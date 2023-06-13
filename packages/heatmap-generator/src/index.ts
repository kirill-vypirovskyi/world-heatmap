const BINARY_DIMENSION_X = 36000;
const DIMENSION_Y = 17999;

const canvas = document.createElement("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const backgroundImage = new Image();
backgroundImage.src = "./assets/empty-map.jpg";

backgroundImage.onload = function () {
  canvas.width = backgroundImage.width;
  canvas.height = backgroundImage.height;
  context.drawImage(backgroundImage, 0, 0);
};

const getColor = (temperature: number): string => {
  let red = 0;
  let green = 0;
  let blue = 0;
  const max = 100;
  const min = 30;
  const diff = max - min;
  const part = diff / 4;
  const perDegree = 255 / part;

  let absolute = temperature - min;
  let counter = 0;

  while (absolute > part) {
    absolute -= part;
    counter++;
  }

  switch (counter) {
    case 0:
      blue = 220;
      green = perDegree * absolute;
      red = 23;
      break;
    case 1:
      blue = 255 - absolute * perDegree;
      green = 255;
      red = 23;
      break;
    case 2:
      green = 255;
      red = perDegree * absolute;
      blue = 24;
      break;
    case 3:
      green = 255 - absolute * perDegree;
      red = 255;
      blue = 24;
      break;
    default:
      break;
  }

  return `rgb(${red}, ${green}, ${blue})`;
};

export const createHeatMap = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const dataView = new DataView(arrayBuffer);

      console.log(dataView);

      let counterX = 0;
      let counterY = 0;

      for (
        let y = DIMENSION_Y - 1;
        y >= 0;
        y -= Math.ceil(DIMENSION_Y / canvas.height)
      ) {
        for (
          let x = 0;
          x < BINARY_DIMENSION_X;
          x += Math.ceil(BINARY_DIMENSION_X / canvas.width)
        ) {
          const offset = y * BINARY_DIMENSION_X + x;
          const temperature = dataView.getUint8(offset);

          if (temperature === 255) {
            counterX += 1;
            continue;
          }

          context.fillStyle = getColor(temperature);
          context.fillRect(counterX, counterY, 1, 1);
          counterX += 1;
        }
        counterX = 0;
        counterY += 1;
      }

      resolve(canvas.toDataURL("image/jpeg"));
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
