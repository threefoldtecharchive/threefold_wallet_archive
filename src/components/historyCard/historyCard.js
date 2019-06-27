import amountIndicator from '../amountIndicator'
import copy from 'clipboard-copy'
import { relative } from 'path'
import { input } from '../../services/tfchain/org.transcrypt.__runtime__'

export default {
  name: 'history-card',
  components: { amountIndicator },
  props: [
    'transaction'
  ],
  data () {
    return {
      outgoing: false
    }
  },
  computed: {
    amount () {
      if (this.transaction) {
        if (this.transaction.inputs && this.transaction.inputs.length) {
          this.outgoing = false
          return this.sumTransactionAmount(this.transaction.inputs)
        } else if (this.transaction.outputs && this.transaction.outputs.length) {
          this.outgoing = true
          return '-' + this.sumTransactionAmount(this.transaction.outputs)
        }
      } else {
        return '---'
      }
    },
    receiverName () {
      return 'receiverName'
    },
    senderName () {
      var senderName = 'senderName not found'
      if (this.transaction.sender) {
        senderName = this.transaction.sender
        try {
          var sender = JSON.parse(this.transaction.sender)
          if (sender && sender.walletname && sender.account) {
            senderName = sender.account
          } else {
            senderName = this.getWalletAddresOfInput()
          }
        } catch (error) {
          senderName = this.getWalletAddresOfInput()
        }
      } else {
        senderName = this.getWalletAddresOfInput()
      }
      return senderName
    },
    receiverAddress () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var address = this.getWalletAddresOfOutput()
      return address
    },
    senderAddress () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var senderAddress = null
      if (this.transaction.confirmed && this.transaction.sender) {
        try {
          var sender = JSON.parse(this.transaction.sender)
          if (sender && sender.walletname && sender.account) {
            senderAddress = `${sender.walletname}@${sender.account}`
          } else {
            senderAddress = this.getWalletAddresOfInput()
          }
        } catch (error) {
          senderAddress = this.getWalletAddresOfInput()
        }
      } else {
        senderAddress = this.getWalletAddresOfInput()
      }

      return senderAddress
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
    sumTransactionAmount (arr) {
      var total = 0
      arr.forEach(output => {
        var amount = output.amount.str({ precision: 3 }).replace(',', '')
        total += parseFloat(amount)
      })
      return total.toLocaleString('nl-BE', { minimumFractionDigits: 2, useGrouping: false })
    },
    copyTransaction () {
      copy(JSON.stringify(this.transaction))
      console.log(this.transaction)
    }
  }
}
