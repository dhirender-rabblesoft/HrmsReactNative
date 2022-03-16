import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import { color } from "../Common/Colors";
import fonts from "../Common/fonts";
import ImagesPath from "../images/ImagesPath";

const DropDownPicker = ({
  pickerStyle,
  pickerPlaceholder = "",
  pickerData = [],
  selectedTextStyle,
  placeholderTextStyle,
  value,
  containerStyle,
  pickerdrop,
  nestedScroll,
  onSelectValue = () => {},
  passID = () => {},
  pickerLabel,
  pickerLabelStyle,
  dropDownType,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <View style={[styles.container, containerStyle]}>
      <View>
        <Text style={[styles.LabelStyle, pickerLabelStyle]}>{pickerLabel}</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowPicker(!showPicker)}
          style={[styles.pickerView, pickerStyle]}
        >
          {value !== "" && (
            <Text style={[styles.selectedText, selectedTextStyle]}>
              {value}
            </Text>
          )}

          {pickerPlaceholder !== "" && (value == "" || value == undefined) && (
            <Text style={[styles.placeholderText, placeholderTextStyle]}>
              {pickerPlaceholder}
              
            </Text>
          )}

          {/* <Ionicons
            name={showPicker ? "chevron-up" : "chevron-down"}
            size={20}
            color={color.black}
            style={{ position: "absolute", right: 8 }}
          /> */}
          <Image source={!showPicker ? ImagesPath.downArrowImg : ImagesPath.upArrowImg}
           style={{position: "absolute", alignSelf: "center", resizeMode: "contain", right: 8, height: 16, width: 16, tintColor: color.imageBlack}}/>
        </TouchableOpacity>
        {showPicker && (
          <View style={[styles.pickerContainer, pickerdrop]}>
            <ScrollView
              nestedScrollEnabled={nestedScroll}
              showsVerticalScrollIndicator={false}
            >
              {pickerData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelectValue(item?.name);
                    setShowPicker(false);
                    passID(item?.id);
                  }}
                  style={styles.pickerItemStyle}
                >
                  <Text style={styles.containerItemStyle}>{item?.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // elevation: 1,
   // width: '19%',
    // zIndex: 1000,
  },
  pickerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -8,
  
  },
  pickerContainer: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: color.lightGray,
    // borderRadius: w(0.3),
    backgroundColor: color.white,
    elevation: 5,
    zIndex: 1,
    position: "absolute",
    top: 40,
  },
  pickerItemStyle: {
    borderTopWidth: 1,
    borderColor: "lightgray",
    justifyContent: "center",
    height: 40,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: "black",
  },
  containerItemStyle: {
    marginLeft: 10,
    color: color.black,
    //fontFamily: fonts.InterRegular,
    fontSize: 16,
  },
  placeholderText: {
    color: "darkgray",
    fontSize: 16,
  },
  LabelStyle: {
    fontSize: 12,
   // fontFamily: fonts.InterMedium,
    color: color.black,
    marginLeft: 8,
  },
});

export default DropDownPicker;
