/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native'
import { SegmentedControls } from 'react-native-radio-buttons'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class Products extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedCurrency: props.selectedCurrency,
      products: props.products
    }
  }

  scrollX = new Animated.Value(0)

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      selectedCurrency: nextProps.selectedCurrency,
      products: nextProps.products
    }
  }

  render() {
    const { title, currencies, setSelectedCurrency } = this.props
    const { selectedCurrency } = this.state
    const viewArray = []
    const { products } = this.state
    const productsLength = products.length
    let position = Animated.divide(this.scrollX, width);

    for (let i = 0; i < productsLength; i = i + 2) {
      viewArray.push(
        (
          <View key={i} style={styles.slideContainer} >
            <View>
              <ImageBackground
                source={{ uri: products[i].url }}
                style={styles.imageStyle}
              />
              <Text style={styles.productName}>{products[i].name}</Text>
              <Text style={styles.currencyText}>{products[i].currency + ' ' + products[i].price}</Text>

            </View>
            {(i + 1 < productsLength) && (
              <View>
                <ImageBackground
                  source={{ uri: products[i + 1].url }}
                  style={styles.imageStyle}
                />
                <Text style={styles.productName}>{products[i + 1].name}</Text>
                <Text style={styles.currencyText}>{products[i + 1].currency + ' ' + products[i + 1].price}</Text>

              </View>
            )}
          </View>
        )
      )
    }

    return (

      <View style={styles.container}>
        <SegmentedControls
          options={currencies}
          onSelection={selectedCurrency => {
            this.setState({ selectedCurrency }, () => setSelectedCurrency(selectedCurrency))
          }}
          selectedOption={selectedCurrency}
          tint={'#007AFF'}
        />
        <View
          style={styles.lineBreak}
        />
        <Text style={styles.titleText}>{title}</Text>

        <View
          style={styles.productContainer}
        >
          <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
              [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
          >
            {viewArray}
          </ScrollView>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }} // this will layout our dots horizontally (row) instead of vertically (column)
        >
          {viewArray.map((_, i) => { // the _ just means we won't use that parameter
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
              outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
              // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
              // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
              extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
            });

            return (
              <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                style={{ opacity, height: 10, width: 10, backgroundColor: '#007AFF', margin: 8, borderRadius: 5 }}
              />
            );
          })}
        </View>
        <View
          style={styles.lineBreak}
        />
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  productName: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    width: (width / 2) * 0.89,
  },
  imageStyle: {
    width: (width / 2) * 0.89,
    height: 200,
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  lineBreak: {
    height: 0.5,
    width,
    backgroundColor: 'gray',
    marginTop: 20
  },
  currencyText: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    width: (width / 2) * 0.89,
    fontWeight: 'bold'
  },
  titleText: {
    marginTop: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  productContainer: {
    width,
    height: width
  },
})

export default Products
