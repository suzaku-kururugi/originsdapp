"use client";

import React, { FC, useEffect, useState } from "react";
import { BloodlineMemberFrom } from "./BloodlineMemberForm";
import { Modal, Header, PasswordModal, Spiner } from "../Common";
import { D3App } from "./d3js/D3App";
import { ToastContainer, toast } from "react-toastify";
import { useCache } from "../../controllers";
import { useWalletContext } from "../context";
import { useAccountEffect } from "wagmi";

import 'react-toastify/dist/ReactToastify.css';


export const ApplicationPage: FC = () => {
  const [modalActive, setModalActive] = useState(false);
  const [editModalOpen, setEditModalActive] = useState<boolean>(false);
  const [passwordModalActive, setPasswordModalActive] = useState(false);

  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [shouldDataUpdate, setUpdate] = useState(false);

  useAccountEffect({
    onDisconnect: () => {
      setLocalStorageData(null);
    }
  })

  const {
    error,
    pending,
    isLoading,
    userAddress,
    isConnected,
    readContract,
    disconnectWallet,
    checkPasswordIsCorrect,
    setLocalCacheChanged
  } = useWalletContext();

  const {
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    isLocalDataMatchToContract,
    resetDataToContractValue,
    clearLocalCache
  } = useCache({ setModalActive, setUpdate, setEditModalActive, setLocalCacheChanged, userAddress });

  const handleReadContract = async () => {
    readContract().then(data => {
      const dataToAssign = localStorage.getItem(`${userAddress}`);

      if (dataToAssign) {
        setLocalStorageData(JSON.parse(dataToAssign).data);
      }
    }).catch(err => {
      if (err.message === "Error: Wrong password") {
        const isEncryptedKeyExist = localStorage.getItem("encrypted");

        if (!isEncryptedKeyExist) {
          localStorage.setItem("encrypted", JSON.stringify(1))
        }

        setPasswordModalActive(true);
      } else {
        console.error(err.message)
      }
    });
  };

  useEffect(() => {
    if (isConnected && !pending.dataPending && !pending.datePending) {
      handleReadContract();
      isLocalDataMatchToContract();
    }
  }, [
      pending.dataPending,
      pending.datePending,
      isConnected
    ]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(localStorage.getItem(`${userAddress}`) || "{}");

      setLocalStorageData(storedData.data);
    }
  }, []);

  useEffect(() => {
    if (shouldDataUpdate) {
      const dataToUpdate = JSON.parse(localStorage.getItem(`${userAddress}`) || "{}");

      setLocalStorageData(dataToUpdate.data);
      setUpdate(false);
    }
  }, [shouldDataUpdate])

  const handleClosePasswordModal = () => {
    disconnectWallet();

    return setPasswordModalActive(false);
  }

  const handleSubmitPasswordModal = async (password: string) => {
    try {
      const isPasswordCorrect = await checkPasswordIsCorrect(password);

      return isPasswordCorrect;
    } catch(err) {
      console.error(err)

      return false;
    }
  }

  if (error) {
    console.error(error.message)
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

      }}
    >
      <Header />

      <Modal
        active={modalActive}
        setActive={setModalActive}
        title="Add Family member"
      >
        {modalActive && (
          <BloodlineMemberFrom
            bloodlineArray={localStorageData}
            onSubmit={addFamilyMember}
          />
        )}
      </Modal>

      <PasswordModal
        active={passwordModalActive}
        onClose={handleClosePasswordModal}
        setActive={setPasswordModalActive}
        submitPassword={handleSubmitPasswordModal}
        handleReadContract={handleReadContract}
      />

      <div className="fixed top-[72px] left-0 h-full w-full">
        <ToastContainer />

        {isConnected ? (
            <>
              {isLoading && (
                <div style={{ width: "100%", height: "100%", position: "absolute", top: "30%", left: "50%"}}>
                  <Spiner />
                </div>
              )}

              {!isLoading &&
                <D3App 
                  data={localStorageData || []}
                  update={updateFamilyMember}
                  deleteFamilyMember={deleteFamilyMember}
                  editModalActive={editModalOpen}
                  setEditModalActive={setEditModalActive}
                  setAddModalActive={setModalActive}
                  handleSubmitPasswordModal={handleSubmitPasswordModal}
                  handleReadContract={handleReadContract}
                  handleResetData={resetDataToContractValue}
                  handleDataWasChanged={isLocalDataMatchToContract}
                  clearLocalCache={clearLocalCache}
                />
              }
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div
                className="bg-[#edb4893e] py-4 px-6 mt-[-100px] rounded-2xl border-2 border-[#ffffffa9] text-[32px]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                {"Please connect your wallet..."}
              </div>
            </div>
          )
        }

        <div
          className="fixed bottom-[-50px] left-[17%] bg-100 bg-no-repeat w-[1230px] h-[1150px] -z-10"
          style={{ backgroundImage: `url(/tree.png)`}}
        />
      </div>
    </div>
  );
};
