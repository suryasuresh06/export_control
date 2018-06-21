'use strict';
const shim = require('fabric-shim');
const util = require('util');
const fs = require('fs');
var crypto = require('crypto');


// change the algo to sha1, sha256 etc according to your requirements
var algo = 'sha256';
var shasum = crypto.createHash(algo);

var file = 'countries.json';
var s = fs.ReadStream(file);

s.on('data', function(d) { shasum.update(d); });
s.on('end', function() {
     var d = shasum.digest('hex');
    console.log(d);
});

var hash = 'b94e9e457865bac91ae9b13b5b1fe5cd03b432b415110f596427e0cd443d03fc';

/*convertExcel = require('excel-as-json').processFile;
convertExcel('trial.xlsx', 'trial.json');*/
var dataset = JSON.parse(fs.readFileSync('trial.json', 'utf8'));
var countries_EU = JSON.parse(fs.readFileSync('countries.json', 'utf8'));
var countries_embargo = JSON.parse(fs.readFileSync('country_embargo.json', 'utf8'));
let country_EU=[];
for (let j=0;j<countries_EU.length;j++){
    country_EU.push(countries_EU[j].Countries_EU);
}
let country_em=[];
for (let j=0;j<countries_embargo.length;j++){
    country_em.push(countries_embargo[j].Countries_Embargo);
}
let Chaincode = class {

    async Init(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret)
        console.info('=========== Instantiated fabcar chaincode ===========');
        return shim.success();
      }
    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);

        let method = this[ret.fcn];
        if (!method) {
           console.error('no function of name:' + ret.fcn + ' found');
           throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
           let payload = await method(stub, ret.params);
           return shim.success(payload);
        }  catch (err) {
           console.log(err);
           return shim.error(err);
        }
    } 


  

    async queryasset(stub, args) {
        if (args.length != 1) {
          throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
        }
        let AssetNumber = args[0];
    
        let assetAsBytes = await stub.getState(AssetNumber); //get the car from chaincode state
        if (!assetAsBytes || assetAsBytes.toString().length <= 0) {
          throw new Error(AssetNumber + ' does not exist: ');
        }
        console.log(assetAsBytes.toString());
        return assetAsBytes;
      }

    async initLedger(stub,args){
        console.info ('Pre-existing assets');
        let dataset_array=[];
        for (let j=0;j<dataset.length;j++){
        dataset_array.push({
            tag: dataset[j].Dataset_Tag,
            infoid: dataset[j].EC_Info_ID,
            geoinfo: dataset[j].Geo_Info,
            etype: dataset[j].Engine_Typ,
            airframer: dataset[j].Airframer,
            name: dataset[j].Operator_Nm,
            country: dataset[j].Operator_Nlty,
            type: dataset[j].Data_Type,
            source_db: dataset[j].Source_db,
            db_owner: dataset[j].db_owner,
            Pers_Data_Ind:dataset[j].Pers_Data_Ind,
            Int_Prop_Ind:dataset[j].Int_Prop_Ind,
            Comm_Sens_Ind:dataset[j].Comm_Sens_Ind,
            Comm_Cons_Ind:dataset[j].Comm_Cons_Ind,
            Cyber_Ind:dataset[j].Cyber_Ind,
            EC_Ind:dataset[j].EC_Ind,
            Reliability_Ind:dataset[j].Reliability_Ind,
            Availability_Ind:dataset[j].Availability_Ind,
            Security_Ind:dataset[j].Security_Ind,
            Capacity_Ind:dataset[j].Capacity_Ind,
            Bandwidth_Ind:dataset[j].Bandwidth_Ind,
            Latnecy_Ind:dataset[j].Latnecy_Ind,
            Future_Proof_Ind:dataset[j].Future_Proof_Ind,
            Scalability_Ind:dataset[j].Scalability_Ind,
            Recovery_Ind:dataset[j].Recovery_Ind,
            Prov_Ind:dataset[j].Prov_Ind,
            Mapping_Ind:dataset[j].Mapping_Ind,
            Pred_Qual_Ind:dataset[j].Pred_Qual_Ind,
            Hazard_Ind:dataset[j].Hazard_Ind,
            RR_Exp_Ind:dataset[j].RR_Exp_Ind,
            Contact_Info:dataset[j].Contact_Info,
            Data_Trnsfr_Mode:dataset[j].Data_Trnsfr_Mode,
            Military_Use:dataset[j].Military_Use,
            Control:dataset[j].Control,
            license: 'YES'

        });
   }
        
        for (let i=0; i<dataset_array.length;i++){
            dataset_array[i].docType = 'dataset_info';
            await stub.putState(dataset[i].Dataset_Tag, Buffer.from(JSON.stringify(dataset_array[i])));
            console.info('Added',dataset_array[i]);
        }

    }

    async initLedgerhash(stub,args){
        console.info ('Hash into Ledger');
        
            await stub.putState('Hash', Buffer.from(JSON.stringify(hash)));
            console.info('Added',hash);
        

    }


    async CreateAsset(stub,args){
        console.info('============= START : Create Asset ===========');
        if(args.length != 11){
            throw new Error('Incorrect Number of ARGUMENTS');
        }
        var asset = {
            docType: 'dataset_info',
            tag: args[0],
            infoid: args[1],
            geoinfo: args[2],
            etype: args[3],
            airframer: args[4],
            name: args[5],
            country: args[6],
            type: args[7],
            source_db: args[8],
            db_owner: args[9],
            Pers_Data_Ind:args[10],
            Int_Prop_Ind:args[11],
            Comm_Sens_Ind:args[12],
            Comm_Cons_Ind:args[13],
            Cyber_Ind:args[14],
            EC_Ind:args[15],
            Reliability_Ind:args[16],
            Availability_Ind:args[17],
            Security_Ind:args[18],
            Capacity_Ind:args[19],
            Bandwidth_Ind:args[20],
            Latnecy_Ind:args[21],
            Future_Proof_Ind:args[22],
            Scalability_Ind:args[23],
            Recovery_Ind:args[24],
            Prov_Ind:args[25],
            Mapping_Ind:args[26],
            Pred_Qual_Ind:args[27],
            Hazard_Ind:args[28],
            RR_Exp_Ind:args[29],
            Contact_Info:args[30],
            Data_Trnsfr_Mode:args[31],
            Military_Use:args[32],
            Control:args[33],
            license: 'YES',

          };
      
          await stub.putState(args[0], Buffer.from(JSON.stringify(asset)));
          console.info('============= END : Create Car ===========');
       /* let indexName = 'country~ID';
        let countryIndexKey = await stub.createCompositeKey(indexName,[asset.country,asset.ID]);
        console.info(countryIndexKey);
        await stub.putState(countryIndexKey,Buffer.from('\u0000'));

        let indexName1 = 'owner~country';
        let ownerIndexKey = await stub.createCompositeKey(indexName1,[asset.owner,asset.country]);
        console.info(ownerIndexKey);
        await stub.putState(ownerIndexKey,Buffer.from('\u0000'));

        console.info('end Init Asset');*/
    }

    

    /* async queryasset(stub,args,thisClass) {
        if (args.length != 1) {
           throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
        }
      
        let assetID = args[0];
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'asset';
        queryString.selector.ID = assetID;
        let method = thisClass['getQueryResultForQueryString'];
        let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
        
        return queryResults;
    }

    async transaction(stub, args){
        let method = thisClass['queryasset'];
        let queryResults = await method(stub,args[0],thisClass);
        
        let asset1 = JSON.parse(queryResults);
        let country1 = asset1.country;
        if (country1=='India') {
            asset1.owner=args[1];
        }
        else {
            console.log('no permission');

        }

        await stub.putState(args[0], Buffer.from(JSON.stringify(asset1)));
    }
    async getQueryResultForQueryString(stub, queryString, thisClass) {

       console.info('- getQueryResultForQueryString queryString:\n' + queryString)
       let resultsIterator = await stub.getQueryResult(queryString);
       let method = thisClass['getAllResults'];
  
       let results = await method(resultsIterator, false);
  
       return Buffer.from(JSON.stringify(results));
    }*/

    

    async transaction (stub,args){
        console.info('Change Owner')
        if (args.length != 2) {
            throw new Error('Incorrect number of arguments. Expecting 2');
          }  
        let assetAsBytes = await stub.getState(args[0]);
        //let asset = JSON.parse(assetAsBytes);
        let asset = JSON.parse(assetAsBytes.toString());
        /*let countries = JSON.stringify(asset.allowed);
        var countries1 = countries.split(",");
        var countryarray = [];
        for (var prop in countries1) {
          countryarray.push(countries1[prop]);
    }*/

       // var country_EU = ['Austria','Italy','Belgium','Latvia','Bulgaria','Lithuania','Croatia','Luxembourg','Cyprus','Malta','Czech','Netherlands','Poland','Portugal','Denmark','Estonia','Finland','Romania','France','Slovakia','Slovenia','Germany','Greece','Spain','Hungary','Sweden','Ireland','UK'];
        //var country_embargo = ['Afghanistan','Balkan','Belarus','Bosnia','Burma','Burundi','CentralAfricanReupblic','Congo','Crimea','Egypt','Eritea','Haiti','Iran','Iraq','NorthKorea','Lebanon','Libya','Russia','Somalia','Sudan','Syria','Ukraine','Venezuela','Yemen','Yugoslavia','Zimbabwe'];
        if((asset.Military_Use=='Designed') || (asset.Military_Use=='Modified'))
    
        {    // throw new Error(country_EU.includes(asset.country));
            //if(countryarray.toString().contains(args[1].toString(){
              if(asset.Control=='UK_Military')
              {
               asset.license = 'YES';
              } 
              
              else if((asset.Control=='EU_Dual') && (((country_EU.indexOf(args[1])<0))) || (country_em.indexOf(args[1])>-1))
              {
               
               asset.license='YES';
              }

              else if (country_em.indexOf(args[1])>-1){

                asset.license='YES';
              }
              else {
                  asset.license='NO';
              }
            
             
          }
        else if (asset.Military_Use=='Civilian')

        {   
            if(asset.Control=='EU_Dual' && (country_EU.indexOf(args[1])>-1) && (country_em.indexOf(args[1])<0))
              {
               asset.license='NO';
              }

              else if(country_em.indexOf(args[1]>-1))
              {
               asset.license='NO';   
              }
        }

      
        await stub.putState(args[0], Buffer.from(JSON.stringify(asset))) ; 

    }
    async transaction2 (stub,args){
      console.info('Change Owner')
      if (args.length != 3) {
          throw new Error('Incorrect number of arguments. Expecting 3');
        }  
      let assetAsBytes = await stub.getState(args[0]);
      let asset = JSON.parse(assetAsBytes);
      let asset = JSON.parse(assetAsBytes.toString());
      /*let countries = JSON.stringify(asset.allowed);
      var countries1 = countries.split(",");
      var countryarray = [];
      for (var prop in countries1) {
        countryarray.push(countries1[prop]);
  }*/
      
          //if(countryarray.toString().contains(args[1].toString(){
            if(asset.colorchange1==args[1] || asset.colorchange2==args[1]){
             asset.color=args[2];
             
            } 
          
           else{
            throw new Error('country not in permitted list');
          }
        
      
      
      
      await stub.putState(args[0], Buffer.from(JSON.stringify(asset))) ; 

  }
};

shim.start(new Chaincode());



