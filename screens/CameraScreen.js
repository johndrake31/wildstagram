import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";


export default function CameraScreen() {
    const [type, setType] = useState(CameraType.back);
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);

    function toggleCameraType() {
        setType((current) => (
          current === CameraType.back ? CameraType.front : CameraType.back
        ));
      }



    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <>
            <Camera style={styles.camera} type={type} ref={cameraRef}

            />
            <Button title='Take a picture' onPress={async () => {
                const pictureMetadata = await cameraRef.current.takePictureAsync();
                console.log("pictureMetadata", pictureMetadata);
                console.log(
                    await ImageManipulator.manipulateAsync(pictureMetadata.uri, [
                      { resize: { width: 800 } },
                    ])
                  );
            }} />
            <Button title='flip camera' onPress={toggleCameraType} />
        </>
    )
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});