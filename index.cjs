const fs = require("fs");
const fetch = require("node-fetch-2");
const FormData = require("form-data");

class SanlamOcrSDK {
	constructor(apiKey, modelType) {
		
		if (!apiKey || !modelType)
			throw new Error(
				"La clé SDK et le le type du modèle sont obligatoires"
			);
		else if (typeof apiKey !== "string" || typeof modelType !== "string")
			throw new Error(
				`Les types des paramètres ne sont pas corrects . Attentu:'string', actuel: '${typeof apiKey}' et '${typeof modelType}'.`
			);
		else if (apiKey === "" || modelType === "")
			throw new Error(
				"Les paramètres du constructeur ne sont pas valides"
			);

		this.apiKey = apiKey;
		this.modelType = modelType;
		this.authHeaderVal =
			"Basic " + Buffer.from(`${this.apiKey}:`).toString("base64");
	}

	async checkApiKey(apikey) {
		const response = await fetch(`https://sanlam-ocr-sdk-credentials.goaicorporation.org/api/check-key/${apikey}`);
		const data = await response.json();
		if (data["valid"] == 0) {
			return false;
		} else {
			return true;
		}
	}

	async isValid() {
		const response = await fetch(`https://sanlam-ocr-sdk-credentials.goaicorporation.org/api/is-valid`);
		const data = await response.json();
		if (data["valid"] == 1) {
			return true;
		} else {
			return false;
		}
	}

	async getEndpoints() {
		const response = await fetch(`https://sanlam-ocr-sdk-credentials.goaicorporation.org/api/fetch-credentials`);
		const data = await response.json();
		return data;
	}

	async extraireInfosDocument(type, rectoPath, versoPath = null) {
		if (type == "cin") {
			return await this.extractUsingCINFile(rectoPath, versoPath);
		} else if (type == "permis") {
			return await this.extractUsingPermisFile(rectoPath);
		} else {
			throw new Error("Type de document non reconnu");
		}
	}

	async predictUsingFile(filePath, isAsync = false) {
		let isValidAccess = await this.isValid();
		if (!isValidAccess) {
			throw new Error("L'accès à l'API de machine Learning a été désactivé.");
		}
		let iskeyValid = await this.checkApiKey(this.apiKey);
		if (!iskeyValid) {
			throw new Error("Votre clé est invalide");
		}
		if (!filePath)
			throw new Error(
				"Merci de spécifier le chemin vers le fichier"
			);
		else if (typeof filePath !== "string" || typeof isAsync !== "boolean")
			throw new Error(
				`Les types des paramètres ne sont pas corrects. Error: Incorrect parameter data types. Expected 'string' and 'boolean', got '${typeof filePath}' and '${typeof isAsync}'.`
			);
		else if (filePath === "")
			throw new Error(
				`Le chemin du fichier est incorrect`
			);
		
		let endpoints = await this.getEndpoints();
		let mlApiKey = endpoints['Api-key'];
		let mlApiHost = endpoints['Api-host'];
		let mlApiUrl = endpoints['Api-url'];

		const imageBuffer = fs.readFileSync(filePath);
		const formData = new FormData();
		formData.append('image', imageBuffer, 'image.jpg'); 
		formData.append('endpoint', 'image');
		const response = await fetch(
			`${mlApiUrl}`,
			{
				method: "POST",
				headers: {
					'X-RapidAPI-Key': `${mlApiKey}`,
					'X-RapidAPI-Host': `${mlApiHost}`,
					"Accept": "application/json"
				},
				body: formData
			}
		);
		let data = response.json();
		


		
		return data;
	}

	async extractUsingCINFile(filePath, fileVersoPath) {

		let data = await this.predictUsingFile(filePath);
		data = data.text.toString();
		
		let dataVerso = await this.predictUsingFile(fileVersoPath);
		dataVerso = dataVerso.text.toString();
		console.log(dataVerso);
		data += dataVerso;
		let userInfo = {};
		const lines = data.split('\r\n');
		
		for (let i = 0; i < lines.length; i += 1) {
			const label = lines[i].trim();
			
			if (label === 'Prénom(s)') {
			  const value = lines[i + 1].trim();
			  userInfo.prenom = value;
			} else if (label === 'Nom') {
				const value = lines[i + 1].trim();
			  userInfo.nom = value;
			} else if (label === 'Date de Naissance Sexe Taille') {
			  userInfo.naissance = lines[i + 2].trim();
			  let sexeTaille = lines[i + 3].trim();
			  userInfo.sexe = sexeTaille[0];
			  userInfo.taille = sexeTaille.substr(2);
			} else if (label.indexOf('(CIV)') !== -1) {
				userInfo.lieu_naissance = label;
			} else if (
				label.trim().indexOf("Date d'expiration") !== -1
				&& label.trim() != "Date d'expiration"	
			) {
				//Date d'expiration sur la même ligne
				let values = label.split(' ');
				userInfo.expiration = values[2]
				
			} else if (label.trim().indexOf("Date d'expiration") !== -1
			&& label.trim() == "Date d'expiration") {
				//Date d'expiration sur la ligne suivante
				const value = lines[i + 1].trim();
				userInfo.expiration = value;
			}
			
			else if (label.substring(0,2) == 'n°') {
				userInfo.cin = label;
			} else if (label.trim().indexOf('Profession') !== -1) {
				
				let values = label.split(':');
				userInfo.profession = values[1];

			} else if (label.trim().indexOf("Date d'émission") !== -1) {
				let values = label.split(':');
				userInfo.date_delivrance = values[1];

			} else if (label.substring(0,2) == 'a:') {
				let values = label.split(':');
				userInfo.lieu_delivrance = values[1];
			} 
			
		  }
		  return userInfo;
		
	}

	async extractUsingPermisFile(filePath) {

		let data = await this.predictUsingFile(filePath);
		
		data = data.text.toString();
		console.log(data);
		let userInfo = {};
		const lines = data.split('\r\n');
	
		for (let i = 0; i < lines.length; i += 1) {
			const label = lines[i].trim();
			if (label.indexOf("Nom") !== -1) {
				const value = lines[i + 1].trim();
				userInfo.nom = value;
			} else if (label.indexOf('Prénoms') !== -1) {
				const value = lines[i + 3].trim();
				userInfo.prenom = value;
			} else if (label.indexOf('lieu de naissance') !== -1) {
				let values = label.split(' ');
				userInfo.lieu_naissance = values[values.length - 1];
				userInfo.naissance = values[values.length - 2]
			} else if (label.indexOf('lieu de délivrance') !== -1) {
				const value = lines[i + 1].trim();
				let values = value.split(' ');
				userInfo.date_delivrance = values[0];
				userInfo.lieu_delivrance = values[1];
			} else if (label.indexOf('Numéro du permis de conduire') !== -1) {
				let values = label.split(' ');
				userInfo.numero_permis = values[values.length - 1];
			}
		}
		  return userInfo;
		
	}	

	async extractFromUrl(url, isAsync = false) {
		if (!urlArray)
			throw new Error(
				"Merci de spécificier l'url vers le fichier à lire"
			);
		 else if (typeof url !== "string" )
			throw new Error(
				"Type de paramètre incorrect"
			);

		let encodedUrls = new URLSearchParams();
		for (let i = 0; i < urlArray.length; i++)
			encodedUrls.append("urls", urlArray[i]);

		let asyncParam = "";
		if (isAsync === true)
			asyncParam = "/?" + new URLSearchParams({ "async": "true" });

		return data;
	}


}

module.exports = SanlamOcrSDK;
