
export interface FamilyMemberInterface {
  id: number;
  name: string;
  dateOfBirth: number;
  dateOfDeath?: number;
  biography?: string;
  parents: number[],
  partners: number[],
}
