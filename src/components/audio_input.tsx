import React, { ReactNode, useState } from 'react';

interface IProps {
    children: ReactNode;
    f: string;
    setF: any;
}

const AudioInput = ({f, setF}: IProps) =>
{
    const [color, setColor] = useState("#7c9dd6");
    const [segments, setSegments] = useState(100 as any);
    const [style, setStyle] = useState(true);
    
    function handleChange(files: FileList)
    {
        console.log(files);
        var url = URL.createObjectURL(files[0])
        setF(url);
        (document.getElementById('audio') as HTMLAudioElement).load();
        //draw canvas
        drawAudio(url);
    }

    //------------Visualizer Functions

    // web audio api
    const audioContext = new AudioContext();

    function drawAudio(url : string) 
    {
        return (
            fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))))
        )
    }

    function normalizeData(filteredData : any[])
    {
        var multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map(n => n * multiplier);
    }

    const filterData = (audioBuffer: AudioBuffer)=> {
        const rawData = audioBuffer.getChannelData(0); 
        const samples = segments; //edit for more or less chunk visuals
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

    const draw = (normalizedData : any[]) => {
        // set up the canvas
        const canvas = document.querySelector("canvas");
        const dpr = window.devicePixelRatio;
        const padding = 20;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
    
        // draw the line segments
        var styleFunc = style===true ? drawChonk : drawLine;
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            } else if (height > canvas.offsetHeight / 2) {
                height = (height > canvas.offsetHeight / 2) as any;
            }
            styleFunc(ctx, x, height, width, (i + 1) % 2);
            // if(style==="chonk") drawChonk(ctx, x, height, width);
            // else drawLine(ctx, x, height, width, (i + 1) % 2);
        }
    };

    const drawLine = (ctx: CanvasRenderingContext2D,
                                x:number,
                                height:any, width:number, isEven:number) => {
        ctx.lineWidth = 900/segments; 
        ctx.strokeStyle = color;
        ctx.beginPath();
        height = isEven ? height : -height;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        //ctx.lineTo(x+width, height);
        ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven as any);
        ctx.lineTo(x + width, 0);
        ctx.stroke();
    };

    const drawChonk = (ctx: CanvasRenderingContext2D,
                        x:number,
                        height:any, width:number) => 
    {
        ctx.lineWidth = 900/segments; 
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x+width/2, -height);
        ctx.lineTo(x+width/2, height);
        ctx.stroke();
    }

    return (
        <div className="Input">
            Let's choose a file! <br/>
            <input type="file" accept="audio/*" onChange={ e => handleChange(e.target.files) } />
            <br/>
            <audio id="audio" controls autoPlay>
                <source src={f}/>
                Oops, your browser doesn't support audio?
            </audio>
            
            <div className="parameters">
                <input type="range" min="50" max="300" className="slider" onChange={ e => setSegments((e.target as HTMLInputElement).value)} onMouseUp={ e => drawAudio(f) }/>
                <input type="checkbox" defaultChecked onChange={e => setStyle(style ? false : true)} onMouseUp={ e => drawAudio(f) }/>
                    
                <body>{style}</body>
            </div>
        </div>
    )

    
}

export default AudioInput;



