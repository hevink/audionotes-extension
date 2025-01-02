//

export const bufferToHex = (buffer: Uint8Array): string => {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const randomBytes = (size: number): string => {
  const bytes = window.crypto.getRandomValues(new Uint8Array(size));
  return bufferToHex(bytes);
};
