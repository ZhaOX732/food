import { useState, useEffect } from 'react'
import {Contract, ethers, } from 'ethers';
import Head from "next/head";
import { Image ,Banner,Notification,Toast,Avatar,Tooltip} from '@douyinfe/semi-ui';

function Home() {
    //ethers v6
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [chainId,setChainId] = useState();
    const [contract, setContract] = useState();
    const [provider,setProvider] = useState();

    const [to,setTo] = useState();
    const[amount,setAmount] = useState();

    const[name,setName] = useState();
    const [data,setData] = useState();
    const[id,setId] = useState();
    // let constract = new Contract("",abi,singer)

    //合约地址和可读abi
    const MYTOKEN_ADDRESS = "0xfefd8B8B70aB4a64D13F7fCD4D0C1C48a7267001";
    const MYTOKEN_ABI = [
        "function createProduct(string memory _name, string memory _productionDate) public",
        "function trackProduct(uint256 _productId, string memory _trackingEvent) public",
        "function getProductTrackingHistory(uint256 _productId) public view returns (string[] memory)",
        "function getProduct(uint256 _id) public view returns (uint256, string memory, address, string memory, string[] memory)",
        "function productCount() public view returns (uint256)",
        "event ProductCreated(uint256 id, string name, address producer, string productionDate)",
        "event ProductTracked(uint256 id, string trackingEvent)",
    ];

    //点击按钮的时候登录
    const connectOnclick = async() => {
        if (!window.ethereum) {
           alert("Metamask not installed")
           return ;
        }
        //这里使用的是ethers BrowserProvider
        const providerWeb3 =  await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);
        Notification.open({
            title: 'Hi, Bytedance',
            content: 'ies dance dance dance',
            duration: 3,
        })

        //获取账户
        const currenAccount = await window.ethereum.request({method: "eth_requestAccounts",});
        setAccount(currenAccount[0]);
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        //获取signer来创建contract实例
        const signer = await providerWeb3.getSigner();

        const contract = await new Contract(MYTOKEN_ADDRESS,MYTOKEN_ABI,signer);
        setContract(contract)
        //获取余额
        const currentBalance = await providerWeb3.getBalance(currenAccount[0]);
        setBalance(ethers.formatEther(currentBalance));

        //切换账号并获取余额
        window.ethereum.on("accountsChanged", function (accountsChange) {
            setAccount(accountsChange[0]);
            providerWeb3.getBalance(accountsChange[0]).then((result) => {
                setBalance(ethers.formatEther(result))
            });
        })
        //获取chainId
        const chainId = await window.ethereum.request({method:"eth_chainId"})
        window.ethereum.on("chainChanged", handleChainChanged);
        setChainId(chainId)

    }

    //实现转账功能
    const sendTransaction = async() =>{
      const signer = await provider.getSigner();
      const tx = {
            to: to,
            value:ethers.parseEther(amount)
        };
        const response =await signer.sendTransaction(tx);
        console.log(response.hash)
        alert(response.hash)
    }

    const createProduct = async() =>{
        try {
            let tx = await contract.createProduct(name,data)
            //等待上链
            await tx.wait()
            contract.on("ProductCreated", (id,name,producer,productionDate) => {
                alert("监听到事件"+id+"|"+name+"|"+producer+"|"+productionDate)
                console.log("监听到事件"+id+"|"+name+"|"+producer+"|"+productionDate)
                event.removeListener();
            });
            alert(tx.hash)
            console.log(tx)
        }catch (error){
            alert(error.message)
        }
    }

    const trackProduct = async() =>{
        try {
            let tx = await contract.trackProduct(id,"这是一个trackEvent")
            //等待上链
            await tx.wait()

            alert(tx.hash)
            console.log(tx)
        }catch (error){
            alert(error.message)
        }
    }

    const getHistory = async() =>{
        try{
            let a  = await contract.getProductTrackingHistory(id);
            const opts = {
                content: '历史是'+a,
                duration: 3,
            };
            Toast.info(opts)
        
        }catch (error){
            alert(error)
        }
        }

    // uint256 public productsCount
    const getCount = async() =>{
        try{
            let a  = await contract.productCount();
            alert("Count为"+a);
        }catch (error){
            alert(error)
        }
    }
    // mapping(uint256 => Product) public products
    const getProducts = async() =>{
        try{
            let a  = await contract.getProduct(id);
            alert(a);
        }catch (error){
            alert(error)
        }
    }

    function handleChainChanged(chainId) {
        window.location.reload();
    }



    return (


        <>
            <Head>
                <link rel="shortcut icon" href="../static/cat.png" />
                <title>食品溯源</title>
            </Head>

            
            <Banner 
            type="info"
            description="Semi D2C 现已支持 Figma DevMode, 安装插件，随时查阅图层对应的前端代码"
        />

            <div className="top">
                <a href="/" style={{float:"left",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>基于区块链的食品溯源</a>
                {/* <a href="vote" style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Vote</a> */}
                {/* <a href="vote_test"style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Test</a> */}
                {account ?
                <>
                    <button href="#" style={{ float: 'right' }} >🔐Connected</button>
                    <Avatar
                    alt="beautiful cat"
                    src="../static/cat.png"
                    style={{ margin: 4 ,marginRight:"20px"}}
                />
                </>
                    :
                    <>
                    <button href="#" style={{ float: 'right' }}onClick={connectOnclick} >🔓️Connect Wallet</button>
            
                </>
                }
            </div>
            <div className="container">

                    <h1 id="title" style={{textAlign:'center' ,color:"deepskyblue"}}>账户信息</h1>
                        <h2 style={{color:"#8ABCD1"}}>Network Type:{chainId}</h2>
                        <h2 style={{color:"#1661AB"}}>Account:{account}</h2>
                        <h2 style={{color:"#1661AB"}}>Balance:{balance}</h2>

                        <hr/>

                    

                   

                        <h1 id="title" style={{textAlign:'center' ,color:"rgba(var(--semi-yellow-2), 1)"}}>食品溯源信息</h1>
                        <input
                            type="text"
                            id="greet"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Input Name"
                        />
                        <input
                            type="text"
                            id="greet"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            placeholder="Input Data"
                        />
                        <Tooltip
                    position='top'
                    content='仔细填写食品信息'>
                        <button  onClick={createProduct}>创建食品</button>
                        </Tooltip>
                        <button onClick={getCount}>查询食品数量</button>
                        <input
                            type="text"
                            id="greet"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Input ID"
                        />
                        <button  onClick={trackProduct}>交易食品</button>
                        <button  onClick={getHistory}>获取历史</button>
                        <button  onClick={getProducts}>获取食品信息</button>
                       
                        <h4 style={{textAlign:'center',color:"grey"}}>The Food Contract Address is <a href="https://www.oklink.com/cn/sepolia-test/address/0xfefd8B8B70aB4a64D13F7fCD4D0C1C48a7267001" style={{textDecoration:"none",color:"lightslategrey"}}>0xfefd8B8B70aB4a64D13F7fCD4D0C1C48a7267001</a></h4>
                        <h5 style={{color:"chocolate",textAlign:'center'}}>Read the doc🦊<a href="https://docs.metamask.io/wallet/">https://docs.metamask.io/wallet/</a></h5>
                        <h5 style={{color:"slateblue",textAlign:'center'}}>Ethers.js v6🍃<a href="https://docs.ethers.org/v6/">https://docs.ethers.org/v6/</a></h5>
            </div>
            
            <style jsx>
                {`
                  * {
                    box-sizing: border-box;
                  }

                  body {
                    font-family: Arial;
                    padding: 10px;
                    background: #f1f1f1;
                  }


                  .top {
                    overflow: hidden;
                    background-color: #E5DFD5;
                    padding: 10px;
                    margin-top: 0;
                  }

                  .top button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #a0b0ee;
                    color: #eacd76;
                    background-color: white;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }

                  .container input {
                    border-top-style: hidden;
                    border-right-style: hidden;
                    border-left-style: hidden;
                    border-bottom-style: groove;
                    font-size: 16px;
                    width: 100%;
                    border-color: rgba(4, 4, 5, 0.1);
                    line-height: 32px;
                  }

                  .container button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #c8f8b8;
                    color: #e7c8a1;
                    background-color: #f1ebc5;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }
                  
                  .custom-alert {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    padding: 10px;
                    border-radius: 5px;
                }




                `}
            </style>

        </>
    )
}

export default Home;

