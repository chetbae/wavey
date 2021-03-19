// export {}
// const audioContext = new AudioContext();

// function drawAudio(url : string) 
// {
//     return (
//         fetch(url)
//         .then(response => response.arrayBuffer())
//         .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
//         .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))))
//     )
// }

// const draw = (normalizedData : any[]) => {
//     // set up the canvas
//     const canvas = document.querySelector("canvas");
//     const dpr = window.devicePixelRatio || 1;
//     const padding = 20;
//     canvas.width = canvas.offsetWidth * dpr;
//     canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
//     const ctx = canvas.getContext("2d");
//     ctx.scale(dpr, dpr);
//     ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
  
//     // draw the line segments
//     const width = canvas.offsetWidth / normalizedData.length;
//     for (let i = 0; i < normalizedData.length; i++) {
//       const x = width * i;
//       let height = normalizedData[i] * canvas.offsetHeight - padding;
//       if (height < 0) {
//           height = 0;
//       } else if (height > canvas.offsetHeight / 2) {
//           height = (height > canvas.offsetHeight / 2) as any;
//       }
//       drawLineSegment(ctx, x, height, width, (i + 1) % 2);
//     }
// };

// const drawLineSegment = (ctx: CanvasRenderingContext2D,
//                             x:number,
//                             height:any, width:number, isEven:number) => {
//     ctx.lineWidth = 1; // how thick the line is
//     ctx.strokeStyle = "red"; // what color our line is
//     ctx.beginPath();
//     height = isEven ? height : -height;
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, height);
//     //ctx.lineTo(x+width, height);
//     ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven as any);
//     ctx.lineTo(x + width, 0);
//     ctx.stroke();
// };

// function normalizeData(filteredData : any[])
// {
//     var multiplier = Math.pow(Math.max(...filteredData), -1);
//     return filteredData.map(n => n * multiplier);
// }

// const filterData = (audioBuffer: AudioBuffer)=> {
//     const rawData = audioBuffer.getChannelData(0); 
//     const samples = 100; //edit for more or less chunk visuals
//     const blockSize = Math.floor(rawData.length / samples);
//     const filteredData = [];

//     for (let i = 0; i < samples; i++) {
//       let blockStart = blockSize * i; // the location of the first sample in the block
//       let sum = 0;
//       for (let j = 0; j < blockSize; j++) {
//         sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
//       }
//       filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
//     }
//     return filteredData;
// };
const audioContext = new AudioContext();

function drawAudio(url) 
{
    return (
        fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))))
    )
}

const draw = (normalizedData) => {
    // set up the canvas
    const canvas = document.querySelector("canvas");
    const dpr = window.devicePixelRatio || 1;
    const padding = 20;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
  
    // draw the line segments
    const width = canvas.offsetWidth / normalizedData.length;
    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      let height = normalizedData[i] * canvas.offsetHeight - padding;
      if (height < 0) {
          height = 0;
      } else if (height > canvas.offsetHeight / 2) {
          height = (height > canvas.offsetHeight / 2);
      }
      drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    }
};

const drawLineSegment = (ctx,
                            x,
                            height, width, isEven) => {
    ctx.lineWidth = 1; // how thick the line is
    ctx.strokeStyle = "red"; // what color our line is
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    //ctx.lineTo(x+width, height);
    ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
};

function normalizeData(filteredData)
{
    var multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

const filterData = (audioBuffer)=> {
    const rawData = audioBuffer.getChannelData(0); 
    const samples = 100; //edit for more or less chunk visuals
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];

    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
};