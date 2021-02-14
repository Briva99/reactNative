import React, { Component } from 'react';
import { Alert, Image, ScrollView , Text, TextInput, TouchableOpacity, View, } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';




class reg extends Component {

  constructor(props) {
  super(props);
  
  this.state ={
    name:"",
    kejadian:"",
    address:"",
    keterangan:"",
    image: null,
    images: null,
    
  }
  
  }

  pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch((e) => alert(e));
  }
  pickSingleBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true,
    })
      .then((image) => {
        console.log('received base64 image');
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height,
          },
          images: null,
        });
      })
      .catch((e) => alert(e));
  }

  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        console.log('removed tmp images from tmp directory');
      })
      .catch((e) => {
        alert(e);
      });
  }

  cleanupSingleImage() {
    let image =
      this.state.image ||
      (this.state.images && this.state.images.length
        ? this.state.images[0]
        : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        console.log(`removed tmp image ${image.uri} from tmp directory`);
      })
      .catch((e) => {
        alert(e);
      });
  }

  cropLast() {
    if (!this.state.image) {
      return Alert.alert(
        'No image',
        'Before open cropping only, please select image'
      );
    }

    ImagePicker.openCropper({
      path: this.state.image.uri,
      width: 200,
      height: 200,
    })
      .then((image) => {
        console.log('received cropped image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeExif: true,
      forceJpg: true,
    })
      .then((images) => {
        this.setState({
          image: null,
          images: images.map((i) => {
            console.log('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
      })
      .catch((e) => alert(e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(video) {
    console.log('rendering video');
    return (
      <View style={{ height: 300, width: 300 }}>
        <Video
          source={{ uri: video.uri, type: video.mime }}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          rate={1}
          paused={false}
          volume={1}
          muted={false}
          resizeMode={'cover'}
          onError={(e) => console.log(e)}
          onLoad={(load) => console.log(load)}
          repeat={true}
        />
      </View>
    );
  }

  renderImage(image) {
    return (
      <Image
        style={{ width: 300, height: 300, resizeMode: 'contain' }}
        source={image}
      />
    );
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }
  
  registerLaporan = ()=>{
     console.log('Test Laporan')
     auth()
    .createLaporan(this.state.name)
    .then((response) => {
      console.log('Laporan dibuat');
      console.log("RESPONSE"+response)
      
        firestore()
          .collection('users')
          .doc(this.state.name)
          .set({
            name: this.state.name,
            kejadian: this.state.kejadian,
            address: this.state.address,
            keterangan: this.state.keterangan
          })
          .then(() => {
            this.props.navigation.navigate("Dashboard")
            console.log('Laporan added!');
          }).catch((error) => {
          Alert.alert("Maaf Gagal Simpan",JSON.stringify(error))
          
          });
      
    
      
    })
    .catch(error => {
      if (error.code === 'auth/email-laporan-in-use') {
        console.log('Laporan sudah dilaporkan!');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('Laporan tidak valid!');
      }
  
      console.error(error);
    });
  
  }


    render() {
        return (
            <View style={styles.container}>

                <ScrollView>
                    {this.state.image ? this.renderAsset(this.state.image) : null}
                    {this.state.images
                        ? this.state.images.map((i) => (
                            <View key={i.uri}>{this.renderAsset(i)}</View>
                        ))
                        : null}
                </ScrollView>

            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../assets/Login1.jpg')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(name) => this.setState({ name : name})}
                    
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Kejadian'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(kejadian) => this.setState({ kejadian : kejadian})}
                   
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    
                    placeholder='Address'
                    onChangeText={(address) => this.setState({ address : address})}
                    
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    multiline={true}
                    numberOfLines={5}
                    placeholder='keterangan'
                    onChangeText={(keterangan) => this.setState({ keterangan : keterangan})}
                    
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                
            {/* pembuatan camera */}

                    <TouchableOpacity
                        onPress={() => this.pickSingleWithCamera(false)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single Image With Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            this.pickSingleWithCamera(false, (mediaType = 'video'))
                        }
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single Video With Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pickSingleWithCamera(true)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>
                            Select Single With Camera With Cropping
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pickSingle(false)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.cropLast()} style={styles.button1}>
                        <Text style={styles.text}>Crop Last Selected Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pickSingleBase64(false)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single Returning Base64</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pickSingle(true)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single With Cropping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pickSingle(true, true)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Single With Circular Cropping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.pickMultiple.bind(this)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Select Multiple</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.cleanupImages.bind(this)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Cleanup All Images</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.cleanupSingleImage.bind(this)}
                        style={styles.button1}
                    >
                        <Text style={styles.text}>Cleanup Single Image</Text>
                    </TouchableOpacity>
      


                <TouchableOpacity
                    style={styles.button}
                    onPress={this.registerLaporan}
                    >
                    <Text style={styles.buttonTitle}>Buat Laporan</Text>
                </TouchableOpacity>
                
            </KeyboardAwareScrollView>
        </View>
        );
    }
}

export default Register;