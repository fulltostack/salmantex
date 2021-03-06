const Sequelize = require('sequelize')
const createHash = require('../utils').createHash
const walletValidator = require('wallet-address-validator')

const UserSchema = (sequelize) => {
  return sequelize.define('user', {
    name: {
      type: Sequelize.STRING(512),
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(1000),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
      required: true,
      unique: false,
      set (password) {
        this.setDataValue('password', createHash(password, process.env.PASSWORD_SALT))
      }
    },
    btc_address: {
      type: Sequelize.STRING(34),
      allowNull: true,
      validate: {
        isValidAddress: address => {
          if (address && !walletValidator.validate(address, 'BTC')) {
            throw new Error('Invalid Ethereum Address')
          }
        }
      },
      unique: true
    },
    btc_balance: {
      type: Sequelize.DECIMAL(18, 8),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 1000000000 },
      get () {
        return parseFloat(this.getDataValue('btc_balance'))
      }
    },
    eth_address: {
      type: Sequelize.STRING(42),
      allowNull: true,
      validate: {
        isValidAddress: address => {
          if (address && !walletValidator.validate(address, 'ETH')) {
            throw new Error('Invalid Bitcoin Address')
          }
        }
      },
      unique: true
    },
    eth_balance: {
      type: Sequelize.DECIMAL(28, 18),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 1000000000 },
      get () {
        return parseFloat(this.getDataValue('eth_balance'))
      }
    },
    transaction_max: {
      type: Sequelize.DECIMAL(28, 18),
      allowNull: false,
      defaultValue: 1000,
      validate: { min: 0, max: 1000000000 }
    }
  }, {
    hooks: {
      beforeFind: (user) => {
        if (user.where && user.where.password) {
          user.where.password = createHash(user.where.password, process.env.PASSWORD_SALT)
        }
      }
    },
    version: true
  })
}

module.exports = UserSchema
