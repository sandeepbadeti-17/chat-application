
export interface UserType {
    id: string;
    name: string;
    email: string;
    pic?: string;
    token?: string;
    _id: string;
  }
  
  export interface ChatType {
    id: string;
    name: string;
    lastMessage: string;
    _id: string;
    isGroupChat: boolean;
    chatName: string;
    users: UserType[]; // Correctly defined as an array of UserType
  }
  