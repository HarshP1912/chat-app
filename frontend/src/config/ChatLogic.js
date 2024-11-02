export const getSender = (loggedUser, users) => {
  // Check if both loggedUser and users are defined and that users has at least 2 elements
  if (!loggedUser || !users || users.length < 2) return "";

  // Ensure users[0] and users[1] have _id properties
  const user1 = users[0];
  const user2 = users[1];

  if (!user1?._id || !user2?._id) return "";

  return user1._id === loggedUser._id ? user2.name : user1.name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length < 2) return {};
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  if (!messages || !messages[i] || !messages[i + 1] || !m.sender) return false;
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  if (
    !messages ||
    !messages[i] ||
    !messages[messages.length - 1] ||
    !messages[messages.length - 1].sender
  )
    return false;
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (!messages || !messages[i] || !m.sender) return "auto";
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      m.sender._id !== userId) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  if (!messages || !messages[i] || !m.sender) return false;
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
