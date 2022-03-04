import React, { useContext } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewBase } from "react-native";
import { OtpVerify } from "./OtpVerify";
import { OverlayContainer } from "../Common/OverlayContainer";
import AppBackgorund from "./BackgroundView";
import String, { strings } from "../Common/String";
import ImagesPath from "../images/ImagesPath";
import { userwhiteUrl } from "../images/ImagesPath";
import { CustomStyling } from "../CustomStyle/CustomStyling";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import { AuthStyle } from "../CustomStyle/AuthStyle";
import Colors, { color } from "../Common/Colors";
import GeoLocationHelper from "../helper/GeoLocationHelper";
import Global from "../Common/Global";
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';
import {getDistance, getPreciseDistance} from 'geolib';
import { UserContext } from "../utils/context";
 
const HomeScreen = ({ navigation = useNavigation() }) => {
   const [userData, setUserData] = useContext(UserContext)
   const OPAYN_LAT="30.8935428"
   const OPAYN_LNG="75.8289174"
   const [data, setData] = useState({});
   const [isLoad, setLoad] = useState(true)
   const [fullIsLoad, setFullIsLoad] = useState(false)
   const [currentLatLocation, setCurrentLatLocation] = useState('');
   const [currentLongLocation, setCurrentLongLocation] = useState('');
   const [message, setMsg] = useState("");
   let InOutClick = "";

   const toast = useToast();

   let formData = new FormData()

   console.log("currentLatLocation", currentLatLocation)
   console.log("currentLongLocation", currentLongLocation)

   var detail = "";
   let subPosition = "";
   let topdatalist = [
      { key: strings.checkin, imagepath: ImagesPath.checkInImage }, { key: strings.checkout, imagepath: ImagesPath.checkOutImage }, { key: strings.qr_code_scanner, imagepath: ImagesPath.barCodeScanner }
   ];
   let adminTopList = [{ key: strings.addUser, imagepath: ImagesPath.addUserImg }, { key: strings.AddAnouncement, imagepath: ImagesPath.announcementImage }];

   let bottomdatalist = [
      { key: strings.leave, imagepath: ImagesPath.leaveImage },
      { key: strings.attendance_list, imagepath: ImagesPath.attendanceListImage },
      { key: strings.calendar, imagepath: ImagesPath.calendarImage },
      { key: strings.request_leave, imagepath: ImagesPath.requestLeaveImage },
      { key: strings.announcement, imagepath: ImagesPath.announcementImage },
      { key: strings.work_history, imagepath: ImagesPath.workHistoryImage },
   ]
   let adminBottomList = [
      { key: strings.leave, imagepath: ImagesPath.leaveImage },
      { key: strings.calendar, imagepath: ImagesPath.calendarImage },
      { key: strings.employees, imagepath: ImagesPath.teamImg },
      { key: strings.emergencyLeave, imagepath: ImagesPath.emergencyImg },
      { key: strings.addHoliday, imagepath: ImagesPath.holidayImg },
   ]

   const retrieveData = async () => {
      try {
         detail = await AsyncStorage.getItem('userData');
         console.log(detail);
         setData(JSON.parse(detail));
      

         // data.user.roles.forEach(element => {
         //    console.log(element)
         // });
        

      }
      catch (error) {
         console.error(error);
      }
      finally {
         setLoad(false);
      }
   };
   useEffect(() => {

      retrieveData();
   }, []);


   const singlePress = (selectedData) => {
      console.log("selectedData ", selectedData)
      if (selectedData.key == (strings.leave)){
         navigation.navigate('leaveList');
      }
      if (selectedData.key == (strings.calendar)) {
         navigation.navigate('CalendarScreen')
      }
      if (selectedData.key == (strings.request_leave)) {
         navigation.navigate('RequestLeaveScreen')
      }
      if (selectedData.key == (strings.employees)){
         navigation.navigate('employeeList')
      }
      if (selectedData.key == (strings.checkin)) {
         setFullIsLoad(true)
         InOutClick = "IN";
         if(calculateDistance()<=30){
            setFullIsLoad(false);
            AttendenceApi();
         } else {
            setFullIsLoad(false);
            alert("You Are Distance 6 : ",calculateDistance());
         }
      }
      if(selectedData.key == (strings.checkout)){
         setFullIsLoad(true)
         InOutClick = "OUT";
         if(calculateDistance()<=30){
            setFullIsLoad(false);
            AttendenceApi();
         } else {
            setFullIsLoad(false);
            alert("You Are Distance 6 : ",calculateDistance());
         }
      }
      // if(calculateDistance()<=30){
      //    setFullIsLoad(false);
      //    AttendenceApi();
      // } else {
      //    setFullIsLoad(false);
      //    alert("You Are Distance 6 : ",calculateDistance());
      // }
   

   }
 

   //API
   const AttendenceApi = async () => {
 
      console.log("FFFFFFFF====>>>>>> ", InOutClick)
      let date = moment(new Date()).format(Global.projct.dateFormates.YearMonthDateTime)
   
      formData.append(Global.projct.apiPrams.lat, currentLatLocation);
      formData.append(Global.projct.apiPrams.lng, currentLongLocation);
      formData.append(Global.projct.apiPrams.time, date);
      formData.append(Global.projct.apiPrams.type, InOutClick);
      console.log("DetialOfCheckInOut " , formData);

      console.log("checkdataeverthing",formData)

      const request = new Request(Global.projct.ios.BASE_URL + Global.projct.apiSuffix.ATTANDANCE, {
         method: 'POST', headers: {
            Accept: 'application/json',
            Authorization: Global.projct.apiPrams.AuthToken
         }, body: formData
      });
      try {
         const response = await fetch(request)
         const json = await response.json();
         setMsg(json.message);
         if (json.hasOwnProperty("data")) {
            setData(json.data);
            const object = JSON.stringify(json.data);
            // setEmail(json)
            console.log("hoursessssss=====>>>>> ", object)
            await AsyncStorage.setItem('userData', object);
            toast.show(json.message);
            //navigation.navigate('HomeScreen');
         }
         else {
            toast.show(json.message, { duration: 4000 });
         }

      } catch (error) {
         console.error(error);
         toast.show(error, { duration: 3000 })
      } finally {
         setFullIsLoad(false);
      }
   };



   // const calculateDistance = () => {
   //    var dis = getDistance(
   //      {latitude: OPAYN_LAT, longitude: OPAYN_LNG},
   //      {latitude: currentLatLocation, longitude: currentLongLocation},
   //    );
   //    alert(
   //      `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
   //    );
   //  };
   //  console.log(calculateDistance)
    
  
    const calculateDistance = () => {
      var dis = getDistance(
        {latitude: currentLatLocation, longitude: currentLongLocation},
        {latitude: OPAYN_LAT, longitude: OPAYN_LNG},
      );
      console.log("Clat: "+ currentLatLocation + " CLog: " + currentLongLocation);
      console.log("OLat: "+ OPAYN_LAT + " OLong: " + OPAYN_LNG);
      console.log("meternow ==> ", dis)
      return dis/1000;
    };
    console.log( "-------->>>>>>>>>>>>>>>>>-------->>>>>>>>>>>>>>>>>",calculateDistance())

    console.log("token =====>>>>>>>> " ,userData.token)
    Global.projct.apiPrams.AuthToken = "Bearer "+userData.token;   //data.token;
    console.log("AuthToken -------->>>>", Global.projct.apiPrams.AuthToken)

    console.log("=====>  ", data);

   return (
      <OverlayContainer>
         <AppBackgorund />

       {fullIsLoad ? <ActivityIndicator/> :  <View style={{flex: 1}}>
               {(userData.user.profile.image != null) ? 
                  (<Image 
                     source={{
                        uri: userData.user.profile.image,
                        method: 'GET'
                     }}
                     style={CustomStyling.imageThumb}
                  />)
                  :
                  (<Image 
                     source={require('../images/userwhite.png')}
                     style={CustomStyling.imageThumb}
                  />)
               }
            <View style={{ marginTop: 20 }}>
               {

                   isLoad ? <ActivityIndicator /> : (<Text style={CustomStyling.title} >{userData.user.name}</Text>)
               }
            </View>
            <View style={{ marginTop: 10 }}>
               {
                   isLoad ? <ActivityIndicator /> : (<Text style={CustomStyling.subTitle} >{userData.user.roles.map(roledata => { return roledata.name })}</Text>)
               }
            </View>

            <View style={{ width: '100%', padding: 10, }}>
               <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={(userData.user.id == 1) ? adminTopList : topdatalist}
                  renderItem={({ item }) =>
                     <TouchableOpacity onPress={() => singlePress(item)} style={{ flex: 1, padding: 5, }}>

                        <View>
                           <View style={homeStyle.homeCardContainer}>
                              <Image style={homeStyle.homeCardImg} source={item.imagepath} />
                              <Text style={homeStyle.homeCardText}> {item.key}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  }
               />
            </View>

            <View style={{ width: '100%', paddingHorizontal: 10, marginTop: 2, flex: 1 }}>
               <FlatList
                 // showsHorizontalScrollIndicator={false}
                  data={(userData.user.id == 1) ? adminBottomList : bottomdatalist}
                  numColumns={3}
                  renderItem={({ item }) =>
                     <TouchableOpacity onPress={() => singlePress(item)} style={{ width: "33.33%", padding: 5, }}>
                        {/* <View style={{margin:5}} > */}
                        <View>
                           <View style={homeStyle.homeCardContainerbottom}>
                              <Image style={homeStyle.homeCardImg} source={item.imagepath} />
                              <Text style={homeStyle.homeCardTextbottom}> {item.key}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  }
               />            
            <GeoLocationHelper setCurrentLatLocation={setCurrentLatLocation} setCurrentLongLocation={setCurrentLongLocation} />
            </View>

         </View>}
      </OverlayContainer>
   );

};

const homeStyle = StyleSheet.create({
   homeCardContainer: {
      marginTop: 35,
      marginStart: 10,
      marginLeft: 10,
      backgroundColor: color.white,
      borderRadius: 12,
      width: 140,
      alignContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      shadowColor: Colors.color.darkGray,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 3,
   },
   homeCardImg: {
      height: 45,
      width: 45,
      alignSelf: 'center',
      resizeMode: "contain"
   },
   homeCardText: {
      width: "100%",
      height: 25,
      fontSize: 12,
      textAlign: 'center',
      color: 'black',
      alignSelf: 'center',
      fontWeight: '600',
      color: Colors.color.gray,
      marginTop: 10,
   },
   homeTitle: {
      marginBottom: 30,
      fontSize: 25,
      color: "#fff",
      textAlign: 'center',
      fontWeight: '700'
   },

   homeCardContainerbottom: {
      marginTop: 10,
      backgroundColor: color.white,
      borderRadius: 12,
      paddingTop: 15,
      width: '100%',
      paddingBottom: 5,
      paddingHorizontal: 8,
      shadowColor: Colors.color.darkGray,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 3,
   },
   homeCardImgBottom: {
      height: 35,
      width: 40,
      alignSelf: 'center',

   },
   homeCardTextbottom: {
      //width: 60,
      height: 30,
      fontSize: 12,
      color: 'black',
      alignSelf: 'center',
      fontWeight: 'bold',
      color: Colors.color.gray,
      marginTop: 10,
      textAlign: "center",
   },
});

export default HomeScreen;
