import * as tf from '@tensorflow/tfjs';
import Jimp from 'jimp';

class ImageUtils{
    static IMAGE_TENSOR_HEIGHT = parseInt(process.env.REACT_APP_IMAGE_TENSOR_HEIGHT)
    static IMAGE_TENSOR_WIDTH = parseInt(process.env.REACT_APP_IMAGE_TENSOR_WIDTH)

    static IMAGE_HEIGHT = parseInt(process.env.REACT_APP_IMAGE_HEIGHT)
    static IMAGE_WIDTH = parseInt(process.env.REACT_APP_IMAGE_WIDTH)

    static loadImage(src) {  
        return new Promise((resolve, reject) => { 
            const img = new Image();    
            img.src = URL.createObjectURL(src) 
            img.onload = () => resolve(img); 
            img.onerror = (err) => reject(err);  
    });}

    static loadImageSrc(src) {  
        return new Promise((resolve, reject) => { 
            const img = new Image();    
            img.src = src 
            img.onload = () => resolve(img); 
            img.onerror = (err) => reject(err);  
    });}


    static convertImageToTensor(image, isDrawn) {  
        const tensorImage = tf.browser.fromPixels(image);

        //nie jest konieczne ale warto uwazac, dla niektorych img po prostu sie wysypuje
        //const croppedTensor = this.cropImageTensor(tensorImage);  
        
        const resizedTensor = this.resizeImageTensor(tensorImage, isDrawn);  
        const batchedTensor = this.batchImageTensor(resizedTensor);  

        return batchedTensor;
    }

    static cropImageTensor(img) {  
        const width = img.shape[0];  
        const height = img.shape[1];
        const shorterSide = Math.min(img.shape[0], img.shape[1]);
        const startingHeight = (height - shorterSide) / 2;
        const startingWidth = (width - shorterSide) / 2;
        const endingHeight = startingHeight + shorterSide;  
        const endingWidth = startingWidth + shorterSide;

        return img.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
    }

    static resizeImageTensor(imageTensor, isDrawn) {
        if((this.IMAGE_TENSOR_HEIGHT !== this.IMAGE_HEIGHT || this.IMAGE_TENSOR_WIDTH !== this.IMAGE_WIDTH) || !isDrawn){

            return tf.image.resizeBilinear(imageTensor, [this.IMAGE_TENSOR_HEIGHT, this.IMAGE_TENSOR_WIDTH]);
        }else{
            
            return imageTensor;
        }
    }

    static batchImageTensor(image) {
        const batchedImage = image.expandDims(0);  
        return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    }

    static isPointThisColor(image, point, color){
        let wantedColor = {...color, r: color.r/2, g: color.g/2, b: color.b/2}
        let encounteredColor = Jimp.intToRGBA(image.getPixelColor(point.getX(), point.getY()))

        let differencePoints = 0;

        differencePoints += Math.abs(wantedColor.r - encounteredColor.r)
        differencePoints += Math.abs(wantedColor.g - encounteredColor.g)
        differencePoints += Math.abs(wantedColor.b - encounteredColor.b)
        differencePoints += Math.abs(wantedColor.a - encounteredColor.a)

        return differencePoints < 100
    }

}

export default ImageUtils;