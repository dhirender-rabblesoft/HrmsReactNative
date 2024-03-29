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
import Toast from "react-native-toast-message";
import moment from 'moment';
import {getDistance, getPreciseDistance} from 'geolib';
import { LoaderContext, UserContext } from "../utils/context";
import apiEndPoints from "../utils/apiEndPoints";
import { apiCall } from "../utils/httpClient";
 
const HomeScreen = ({ navigation = useNavigation() }) => {
   const [userData, setUserData] = useContext(UserContext)
   const OPAYN_LAT="30.8935"
   const OPAYN_LNG="75.8290"
   const [fullIsLoad, setFullIsLoad] = useState(false)
   const [currentLatLocation, setCurrentLatLocation] = useState('');
   const [currentLongLocation, setCurrentLongLocation] = useState('');
   const { showLoader, hideLoader } = useContext(LoaderContext);
   var InOutClick = "";

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
   ];
   let adminBottomList = [
      { key: strings.leave, imagepath: ImagesPath.leaveImage },
      { key: strings.calendar, imagepath: ImagesPath.calendarImage },
      { key: strings.employees, imagepath: ImagesPath.teamImg },
      { key: strings.emergencyLeave, imagepath: ImagesPath.emergencyImg },
      { key: strings.addHoliday, imagepath: ImagesPath.holidayImg },
   ];


   const singlePress = (selectedData) => {
      if (selectedData.key == (strings.leave)){
         navigation.navigate('leaveList');
      }
      if (selectedData.key == (strings.calendar)) {
         navigation.navigate('CalendarScreen');
      }
      if (selectedData.key == (strings.request_leave)) {
         navigation.navigate('RequestLeaveScreen');
      }
      if (selectedData.key == (strings.employees)){
         navigation.navigate('employeeList');
      }
      if (selectedData.key == (strings.attendance_list)){
         navigation.navigate('Attendance List');
      }
      if (selectedData.key == (strings.addUser)){
         navigation.navigate('addEmployee');
      }
      if (selectedData.key == strings.work_history){
         navigation.navigate('workHistory');
      }
      if (selectedData.key == strings.AddAnouncement){
         navigation.navigate('addAnnouncementView');
      }
      if (selectedData.key == strings.addHoliday){
         navigation.navigate('addHoliday');
      }
      if (selectedData.key == strings.emergencyLeave){
         navigation.navigate('emergencyLeave');
      }
      if (selectedData.key == strings.announcement){
         navigation.navigate('Announcements');
      }
      if (selectedData.key == strings.qr_code_scanner){
         navigation.navigate('barcode');
      }
      if (selectedData.key == (strings.checkin)) {
         InOutClick = "IN";
         if(calculateDistance()<=20){
            showLoader();
            AttendenceApi();
         } else {
            Toast.show({type: "error", text1: "Attendance can me marked between 20 meters of distance. You are "+calculateDistance()+"m away from office area."});
         }
      }
      if(selectedData.key == (strings.checkout)){
         InOutClick = "OUT";
         if(calculateDistance()<=20){
            showLoader();
            AttendenceApi();
         } else {
            Toast.show({type: "error", text1: "Attendance can me marked between 20 meters of distance. You are "+calculateDistance()+"m away from office area."});
         }
      }
   }
 
   const AttendenceApi = async () => {
 
      let date = moment(new Date()).format(Global.projct.dateFormates.YearMonthDateTime)

      try {
         const {data} = await apiCall("POST", apiEndPoints.MarkAttendance, {lat: currentLatLocation, lng: currentLongLocation, timing: date, type: InOutClick});
         if (data.hasOwnProperty("data")){
            Toast.show({type: "success", text1: data.message});
         }
         else{
            Toast.show({type: "error", text1: data.message});
         }
      } catch (error) {
         Toast.show({type: "error", text1: error});
      } finally {
         hideLoader();
      }
   };    
  
    const calculateDistance = () => {
      var dis = getDistance(
        {latitude: currentLatLocation, longitude: currentLongLocation},
        {latitude: OPAYN_LAT, longitude: OPAYN_LNG},
      );
     
      return dis/1000;
    };

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
                   <Text style={CustomStyling.title} >{userData.user.name}</Text>
               }
            </View>
            <View style={{ marginTop: 10 }}>
               {
                  <Text style={CustomStyling.subTitle} >{userData.user.roles.map(roledata => { return roledata.name })}</Text>
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
                           <View style={CustomStyling.homeCardContainer}>
                              <Image style={[CustomStyling.homeCardImg, {tintColor: (item.key == strings.checkout) ? null : color.imageBlack}]} source={item.imagepath} />
                              <Text style={CustomStyling.homeCardText}> {item.key}</Text>
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
                           <View style={CustomStyling.homeCardContainerbottom}>
                              <Image style={[CustomStyling.homeCardImgBottom, {tintColor: (item.key == strings.leave || item.key == strings.emergencyLeave) ? null : color.imageBlack}]} source={item.imagepath} />
                              <Text style={CustomStyling.homeCardTextbottom}> {item.key}</Text>
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

export default HomeScreen;
