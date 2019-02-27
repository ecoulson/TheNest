const CDNUrl = "https://api.github.com/repos/ecoulson/TheNestCDN/contents/";
const fetch = require('node-fetch');
const fs = require('fs');

class GithubCDN {
	static async writeImage(filename, filePath) {
		const fileURL = `${CDNUrl}images/${filename}`;
		console.log(fileURL);
		const response = await fetch(fileURL, {
			method: "PUT",
			headers: {
				"Authorization": `token ${process.env.GITHUB_TOKEN}`
			},
			body: JSON.stringify({
				message: `Added file: '${filename}' to CDN`,
				content: await readFile(filePath)
			})
		});
		const githubFile = await response.json();
		return githubFile.content.download_url;
	}
}

async function readFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'base64', (error, data) => {
			if (error) {
				return reject(error);
			} else {
				return resolve(data);
			}
		});
	});
}

module.exports = GithubCDN;