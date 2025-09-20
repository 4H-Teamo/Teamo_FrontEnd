export const formatTime = (timestamp: string): string => {
  const now = Date.now();
  const diffInMinutes = Math.floor(
    (now - new Date(timestamp).getTime()) / 60000
  );

  switch (true) {
    case diffInMinutes < 1:
      return "방금 전";
    case diffInMinutes < 60:
      return `${diffInMinutes}분 전`;
    case diffInMinutes < 1440:
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    default:
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
  }
};
