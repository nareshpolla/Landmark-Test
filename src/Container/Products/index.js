/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import ProductsComponent from '../../Components/Products'
import getCurrencyConvertedPrice from '../../Utils/Currency'

const PRODUCTS_URL = 'https://a2b7cf8676394fda75de-6e0550a16cd96615f7274fd70fa77109.r93.cf3.rackcdn.com/common/json/assignment.json'

class Products extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      title: null,
      error: null,
      currencies: [],
      selectedCurrency: null,
      products: null
    }
  }

  setSelectedCurrency = selectedCurrency => {
    this.setState({ selectedCurrency }, () => this.convertCurrency());
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    RNFetchBlob.config({
      trusty: true
    })
      .fetch('GET', PRODUCTS_URL)
      .then(response => response.json())
      .then((responseJson) => {
        const currenciesList = responseJson.products.map(pr => pr.currency)

        this.setState({
          title: responseJson.title,
          products: responseJson.products,
          currencies: [...new Set(currenciesList)],
          selectedCurrency: [...new Set(currenciesList)][0]
        }, () => {
          this.convertCurrency()
        })
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          title: null,
          error,
          products: null
        })
      }
      )
  }

  convertCurrency = () => {
    let products = [...this.state.products];
    let currencyConvertedProducts = products.map(p => {
      let price = this.getPrice(p.currency, p.price)
      return { ...p, price, currency: this.state.selectedCurrency }
    })
    this.setState({
      products: currencyConvertedProducts,
      isLoading: false
    })
  }

  getPrice = (givenCurrency, price) => {
    return getCurrencyConvertedPrice(givenCurrency, price, this.state.selectedCurrency);
  }

  render() {
    const { title, error, isLoading, currencies, selectedCurrency, products } = this.state
    return (
      isLoading ? <ActivityIndicator
        size="large"
        style={styles.loader}
      />
        : <ProductsComponent
          title={title}
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={this.setSelectedCurrency}
          products={products}
        />
    )
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Products
