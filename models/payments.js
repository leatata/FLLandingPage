/* Object/Relational mapping for instances of the Order class.
     - classes correspond to tables
     - instances correspond to rows
     - fields correspond to columns
In other words, this code defines how a row in the postgres order table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("payment", {
    txn_id: {type: DataTypes.STRING, allowNull: false},
    payment_status: {type: DataTypes.STRING},
    amount_gross: {type: DataTypes.FLOAT},
    amount_tax: {type: DataTypes.FLOAT},
    payer_id: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    firstname: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    address_street: {type: DataTypes.STRING},
    address_city: {type: DataTypes.STRING},
    address_country: {type: DataTypes.STRING},      
    address_zip: {type: DataTypes.STRING}
  });
};

