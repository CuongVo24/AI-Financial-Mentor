module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // <--- BẠN ĐANG THIẾU DÒNG QUAN TRỌNG NÀY
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // Lưu ý: Dòng này phải luôn nằm cuối cùng
    ],
  };
};