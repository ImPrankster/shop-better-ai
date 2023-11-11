export const parser = {
  tagline: {
    trim: (str: string) => {
      const colonIndex = str.indexOf(":");
      if (colonIndex !== -1) {
        return str
          .substring(colonIndex + 1)
          .replace(/"/g, "")
          .trim();
      }
      return str.replace(/"/g, "").trim();
    },
  },
};
