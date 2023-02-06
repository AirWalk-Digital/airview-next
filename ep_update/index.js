const axios = require('axios')

exports.padUpdate = (hookName, context) => {
  console.log('update')
  try {
    axios.get(`http://localhost:3000/api/update?pad=${context.pad.id}`)
  } catch (error) {
    console.log('Error updating')  
    console.log(error)
    console.log(error.message)
  }
};