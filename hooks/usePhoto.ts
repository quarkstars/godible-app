import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const usePhoto = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

  const takePhoto = async (userId: string) => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const response = await uploadToCloudinary(photo.webPath, userId);
    console.log("PHOTO", response);

    return response;
  };

  const uploadToCloudinary = async (photoURI, publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME!
    setIsLoading(true);
    try {
        const { signature, timestamp } = await Parse.Cloud.run('getCloudinarySignature');
        if (!signature) throw "No signature"
        const base64Image = await blobUrlToBase64(photoURI);
        if (typeof base64Image !== "string") throw "Failed to convert to base64"

        const data = new FormData();
        data.append('file', base64Image);
        data.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!); 
        data.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET!); 
        data.append('cloud_name', cloudName); 
        data.append('timestamp', timestamp);
        data.append('public_id', publicId);
        data.append('signature', signature);
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Replace YOUR_CLOUD_NAME with your Cloudinary cloud name
        {
          method: 'POST',
          body: data,
        }
      );
    
      const jsonResponse = await response.json();
      setIsLoading(false);
      return jsonResponse
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        setError(error);
    }
    finally {
        setIsLoading(false);
    }
  };

  const blobUrlToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  return {
    takePhoto,
    isLoading,
    error,
  };
};

export default usePhoto;