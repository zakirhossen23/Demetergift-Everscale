import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import ERC721Singleton from './ERC721Singleton';

export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const provider = new ethers.providers.JsonRpcProvider("https://goerli.gateway.metisdevops.link");
				const signer = new ethers.Wallet("fb57cdb52c16a26a9f54d37ce8f106bc4a334772d5c376c08f009e042cb0a7fe", provider);

				const contract = { contract: null, signerAddress: null };

				contract.contract = ERC721Singleton(signer);
				contract.signerAddress = await signer.getAddress();
				window.contract = contract.contract;
				setContractInstance(contract);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();

		window.ethereum.on('accountsChanged', fetchData);
		window.ethereum.on('chainChanged', fetchData);

		return () => {
			window.ethereum.removeListener('accountsChanged', fetchData);
			window.ethereum.removeListener('chainChanged', fetchData);
		};
	}, []);

	return contractInstance;
}
