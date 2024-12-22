interface User {
  _id: string;
  name: string;
  email?: string; // Optional fields
  pic?: string;
  token?: string;
}

export const getSender = (loggedUser: User, users: User[]): string => {
  if (!users || users.length < 2) {
    return "Unknown Sender"; // Fallback for invalid user array
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser: User, users: User[]): User | null => {
  if (!users || users.length < 2) {
    return null; // Return null for invalid user array
  }
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
