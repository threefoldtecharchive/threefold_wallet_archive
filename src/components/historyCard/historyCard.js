import amountIndicator from '../amountIndicator'
import copy from 'clipboard-copy'

export default {
  name: 'history-card',
  components: { amountIndicator },
  props: [
    'transaction'
  ],
  data () {
    return {
      outgoing: false,
      valuta: 'tft',
      show: false
    }
  },
  computed: {
    amountModal () {
      return this.amountHandler(true)
    },
    amount () {
      return this.amountHandler(false)
    },
    receiver () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var receiverName = this.getWalletAddresOfOutput()
      return receiverName
    },
    sender () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var senderAddress = this.getWalletAddresOfInput()
      return senderAddress
    },
    timeStamp () {
      var date = new Date(0)
      console.log('time', this.transaction)
      date.setUTCSeconds(this.transaction.timestamp)
      return date.toLocaleDateString()
    },
    fee () {
      var total = 0
      var fees = this.transaction.outputs.filter(x => x.is_fee)
      fees.forEach(fee => {
        var amount = fee.amount.str({ precision: 3 }).replace(',', '')
        total += parseFloat(amount)
      })
      return total.toLocaleString('nl-BE', { minimumFractionDigits: 2, useGrouping: false })
    }
  },
  mounted () {

  },
  methods: {
    getWalletAddresOfInput () {
      var address = null
      if (this.transaction.inputs && this.transaction.inputs.length) {
        var input = this.transaction.inputs.find(x => !x.fee)
        if (input) {
          address = input.senders[0]
        }
      } else {
        address = 'Address not found'
      }
      return address
    },
    getWalletAddresOfOutput () {
      var address = null
      if (this.transaction.outputs && this.transaction.outputs.length) {
        var output = this.transaction.outputs.find(x => !x.fee)
        if (output) {
          address = output.recipient
        }
      } else {
        address = 'Address not found'
      }
      return address
    },
    sumTransactionAmount (arr, modal) {
      var total = 0.00
      arr.forEach(output => {
        var amount = output.amount.str()
        total += parseFloat(amount)
      })
      
      total = total.toString()

      if ((total.substr(total.indexOf('.')).length > 4) && !modal) {
        total = total.substr(0, total.indexOf('.') + 3) + '..'
      } else if (total.substr(total.indexOf('.')).length < 3) {
        total = parseFloat(total)
      }

      return total.toLocaleString('en', { minimumFractionDigits: 2, useGrouping: false })
    },
    copyTransaction () {
      copy(JSON.stringify(this.transaction))
    },
    isJsonObject (obj) {
      try {
        JSON.parse(obj)
        return true
      } catch (e) {
        return false
      }
    },
    amountHandler (modal) {
      if (this.transaction) {
        if (this.transaction.inputs && this.transaction.inputs.length) {
          this.outgoing = false
          return this.sumTransactionAmount(this.transaction.inputs, modal)
        } else if (this.transaction.outputs && this.transaction.outputs.length) {
          this.outgoing = true
          return '-' + this.sumTransactionAmount(this.transaction.outputs, modal)
        }
      } else {
        return '---'
      }
    }
  }
}
