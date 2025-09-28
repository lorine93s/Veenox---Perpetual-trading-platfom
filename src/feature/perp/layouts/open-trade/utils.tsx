export const getLeverageFromMarkValue = (mark: number) => {
  switch (mark) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 10;
    case 7:
      return 15;
    case 8:
      return 20;
    case 9:
      return 30;
    case 10:
      return 40;
    case 11:
      return 50;
    default:
      return 1;
  }
};

export const getMaxLeverageToValue = (maxLeverage: number) => {
  switch (maxLeverage) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 10:
      return 6;
    case 15:
      return 7;
    case 20:
      return 8;
    case 30:
      return 9;
    case 40:
      return 10;
    case 50:
      return 11;
    default:
      return 10;
  }
};
