"use client";
import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import { select, Selection } from "d3-selection";
import { zoom as d3zoom, zoomIdentity } from "d3-zoom";

import { useIdleTimer } from "../../../controllers";

import { IconButton, ZoomButton, Modal, PasswordModal, WipeButton } from "../../Common";
import { SelectEncryptionMethod } from "../../SelectEncryptionMethod/SelectEncryptionMethod";
import { BloodlineMemberFrom } from "../BloodlineMemberForm";
import { convertDataForGraph } from "../../../utils/generateTree";

import { drawFamilyNodeItem, drawLink } from "./d3utils";
import { updateFormMapper } from "../../../utils";
import { LinkInterface } from "../../../utils/types";
import { useWalletContext } from "../../context";

interface D3AppProps {
  data: any;
  update: (json: Record<string, any>, form: any) => void;
  deleteFamilyMember: (id: number) => void;
  editModalActive: boolean;
  setAddModalActive: Dispatch<SetStateAction<boolean>>;
  setEditModalActive: Dispatch<SetStateAction<boolean>>;
  handleSubmitPasswordModal: (password: string) => Promise<boolean>;
  handleReadContract: () => Promise<void>;
  handleResetData: () => void;
  handleDataWasChanged: () => boolean | "error";
  clearLocalCache: () => void;
}

export const D3App: FC<D3AppProps> = (props) => {
  const {
    data: dataToConvert,
    update,
    deleteFamilyMember,
    editModalActive,
    setAddModalActive,
    setEditModalActive,
    handleSubmitPasswordModal,
    handleReadContract,
    handleResetData,
    handleDataWasChanged,
    clearLocalCache
  } = props;

  const [selection, setSelection] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null);
  const [rendered, setRendered] = useState(false);
  const [membersArr, setMembersArr] = useState<any[]>([]);
  const [innerWidth, setInnerWidth] = useState(1920);
  const [innerHeight, setInnerHeight] = useState(1080);
  const [initialFormValue, setInitialFormValue] = useState<any>();

  const [encryptModalOpen, setEncryptModalOpen] = useState<boolean>(false);
  const [secondaryPasswordModalActive, setSecondaryPasswordModalActive] = useState(false);

  const {
    disconnectWallet,
    isConnected,
    checkPasswordIsCorrect,
    sendTx,
    wipeContractData,
    userAddress,
    localCacheChanged
  } = useWalletContext();

  const timer = 20 * 60 * 1000; // 20 minutes of idle

  const onIdle = () => {
    if (isConnected) {
      disconnectWallet();
      sessionStorage.clear();
    }
    
    return;
  }

  const { isIdle } = useIdleTimer(timer, onIdle);

  const handleEncryptModalOpen = async () => {
    const encryptedKey = localStorage.getItem("encrypted");

    if(!encryptedKey) {
      setEncryptModalOpen(true);

    } else {
      const isEncrypted = JSON.parse(encryptedKey);
      const password = sessionStorage.getItem("userKey");

      if (isEncrypted) {
        if (!password) {
          isEncrypted === 1 ? setSecondaryPasswordModalActive(true) : null;
  
          console.error("Password is not exist");
          return
        }

        const isPasswordCorrect = await checkPasswordIsCorrect(password);

        if (isPasswordCorrect) {
          sendTx();
        } else {
          setSecondaryPasswordModalActive(true)
        }
      } else {
        sendTx();
      }
    }
  }

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<any>(null);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    const data = convertDataForGraph(dataToConvert);
    setMembersArr(data.nodes);

    if (selection) {
      const container = selection.select("g");
      container.selectAll("*").remove();

      data.links.forEach((link: LinkInterface) => {
        drawLink(container, link, data.nodes, familyMemberNodeSize);
      });

      data.nodes.forEach((member: any) => {
        drawFamilyNodeItem(
          container,
          userAddress,
          member,
          handleMove,
          handleMoreInfoClick,
          handleDataWasChanged,
          familyMemberNodeSize,
          innerWidth,
          innerHeight
        );
      });
    }
  }, [dataToConvert, selection]);

  const margin = { top: 20, right: 20, bottom: 50, left: 40 };
  const width = innerWidth - margin.left - margin.right;
  const height = innerHeight - margin.top - margin.bottom;

  const familyMemberNodeSize = {
    width: 270,
    height: 150,
  };

  const handleMove = useCallback((id: string, x: number, y: number) => {
    const index = membersArr.findIndex((item: any) => item.id === id);

    if (index !== -1) {
      const updatedMembersArr = [...membersArr];
      updatedMembersArr[index] = { ...updatedMembersArr[index], x, y };

      setMembersArr(updatedMembersArr);
    }
  }, [membersArr]);

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      if (!rendered) {
        const data = convertDataForGraph(dataToConvert);
        const container = selection.append("g");

        data.links.forEach((link: LinkInterface) => {
          drawLink(container, link, data.nodes, familyMemberNodeSize);
        });

        data.nodes.forEach((member: any) => {
          drawFamilyNodeItem(
            container,
            userAddress,
            member,
            handleMove,
            handleMoreInfoClick,
            handleDataWasChanged,
            familyMemberNodeSize,
            innerWidth,
            innerHeight
          );
        });

        const zoomHandler = d3zoom()
          .scaleExtent([0.2, 3])
          .on("zoom", (event: any) => {
            container.attr("transform", event.transform);
          });

          // @ts-ignore
        selection.call(zoomHandler);

        zoomRef.current = zoomHandler;

        const nodesHTMLCollection = container.selectAll("*").nodes();
        const nodesArray = nodesHTMLCollection.map((node: any) => node.__data__);
        setMembersArr(nodesArray);

        setRendered(true);
      }
    }
  }, [selection, rendered, dataToConvert, innerWidth, innerHeight, handleMove]);

  const handleMoreInfoClick = (e: any) => {
    setEditModalActive(true);
    const value = updateFormMapper(e.target.__data__, dataToConvert);

    setInitialFormValue(value);
  }

  const handleZoomIn = () => {
    if (!selection || !zoomRef.current) return;
    selection.transition().duration(500).call(
      zoomRef.current.scaleBy, 1.2
    );
  };

  const handleZoomOut = () => {
    if (!selection || !zoomRef.current) return;
    selection.transition().duration(500).call(
      zoomRef.current.scaleBy, 0.8
    );
  };

  const handleResetZoom = () => {
    if (!selection || !zoomRef.current) return;

    selection
      .transition()
      .duration(500)
      .call(zoomRef.current.transform, zoomIdentity);
  };

  return (
    <div >
      {/* Application functional buttons section */}
      <div className="fixed top-20 left-4 h-fit flex flex-col justify-between gap-2">
        <IconButton
          src="/add_user.svg"
          alt="add_user_icon"
          onClick={() => setAddModalActive(true)}
          tooltip="Add Family Node"
        />
        <IconButton
          src="/send_icon.svg"
          alt="send_icon"
          onClick={() => handleEncryptModalOpen()}
          width={30}
          height={30}
          tooltip="Send to contract"
          highlited={localCacheChanged}
          disabled={!localCacheChanged}
        />
        <IconButton
          src="/read_icon.svg"
          alt="read_icon"
          onClick={() => handleReadContract()}
          width={30}
          height={30}
          tooltip="Read contract"
        />
        <IconButton
          src="/reset_data.svg"
          alt="reset_data_icon"
          onClick={() => handleResetData()}
          width={30}
          height={30}
          tooltip="Reset data"
          disabled={!localCacheChanged}
        />
      </div>

      <div className="fixed bottom-4 left-4 h-fit">
        <WipeButton
          wipeContract={wipeContractData}
          clearLocalCache={clearLocalCache}
        />
      </div>

      {/* Zoom button section */}
      <div className="fixed bottom-4 right-4 h-[130px] flex flex-col justify-between">
        <ZoomButton symbol="+" onClick={handleZoomIn} />
        <ZoomButton symbol="-" onClick={handleZoomOut} />
        <ZoomButton symbol="reset" onClick={handleResetZoom} />
      </div>

      <svg ref={svgRef} width={innerWidth} height={innerHeight} />

      <Modal
        active={editModalActive}
        setActive={setEditModalActive}
        title={"Edit Family Member"}
      >
        {editModalActive && <BloodlineMemberFrom
          bloodlineArray={dataToConvert}
          onSubmit={update}
          initialValues={initialFormValue}
          deleteFamilyMember={deleteFamilyMember}
        />}
      </Modal>

      <SelectEncryptionMethod active={encryptModalOpen} setActive={setEncryptModalOpen} />
      <PasswordModal
        active={secondaryPasswordModalActive}
        setActive={setSecondaryPasswordModalActive}
        submitPassword={handleSubmitPasswordModal}
        shouldSendTx={true}
        handleReadContract={handleReadContract}
      />

    </div>
  );
};