import { useState, useEffect } from 'react'
import {Contract, ethers, } from 'ethers';
import Head from "next/head";

function Vote(){
    const [account, setAccount] = useState();
    const [contract, setContract] = useState();
    const [provider,setProvider] = useState();
    const [name,setName] = useState();
    const [studentID,setStudentID] = useState();
    const [candidateID,setCandidateID] = useState();


    const CONTRACT_ADDRESS = "0x5836000c2af5a097b63579c64b6a77bd9fa7f290";
    //公共变量在abi中也被视为可读函数，即下面candidateCount的写法
    const CONTRACT_ABI = [
        "function addCandidate(string memory _name,uint _studentID) public",
        "function vote(uint _candidateId) public",
        "function getCandidate(uint _candidateId) public view returns (string memory, uint,uint)",
        //以下为自己添加的写法，获取一些公共变量
        "function candidateCount() public view returns (uint)",
        "function hasVoted(address _voter) public view returns (bool)",
        "function Owner() public view returns (address)",
    ];


    // http://localhost:8545, which most nodes use.
   // provider = new ethers.JsonRpcProvider(url)
   // signer = await provider.getSigner()

    const connectOnclick = async() => {
        if (!window.ethereum) {
            alert("Metamask not installed")
            return ;
        }
        //这里使用的是ethers BrowserProvider
        const providerWeb3 =  await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);

        //获取账户
        const currenAccount = await window.ethereum.request({method: "eth_requestAccounts",});
        setAccount(currenAccount[0]);
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        //获取signer来创建contract实例
        const signer = await providerWeb3.getSigner();

       const contract =  await new Contract(CONTRACT_ADDRESS,CONTRACT_ABI,signer);
       console.log(contract.name)

        setContract(contract)
    }

    //添加候选者
    const addCandidate = async() => {
        try {
            let tx = await contract.addCandidate(name, parseInt(studentID))
            //等待上链
            await tx.wait()
            alert(tx.hash)
            console.log(tx)
        } catch (error) {
            alert(error.message)
        }
    }

   //获取候选者信息
    const getCandidate = async() => {
        try {
            let candidate = await contract.getCandidate(parseInt(candidateID))
            alert(candidate)
        } catch (error) {
            alert(error.message)
        }
    }


   //获取candidateCount数量
    const getCandidateCount = async() => {
        try {
            let count = await contract.candidateCount()
            alert("The CandidateCount is: "+count)
            console.log(count)
        } catch (error) {
            alert(error.message)
        }
    }

   //给指定地址投票
    const voteCandidate = async() => {
        try {
            let tx = await contract.vote(candidateID)
            tx.wait()
            alert(tx.hash)
            console.log(tx)
        } catch (error) {
            alert(error.message)
        }
    }

    //查询当前地址是否投过票
    const hasVoted = async() => {
        try {
            let boolVoted = await contract.hasVoted(account)
            alert("The VoteStatus is: "+boolVoted)
        } catch (error) {
            alert(error.message)
        }
    }

    return(
            <>
                <Head>
                    <link rel="shortcut icon" href="../static/cat.png" />
                    <title>2024-Dapp</title>
                </Head>

                <div className="top">
                    <a href="/" style={{float:"left",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Home</a>
                    <a href="vote" style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Vote</a>
                    <a href="vote_test"style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Test</a>
                    {account ?
                        <button href="#" style={{ float: 'right' }} >🔐Connected</button>
                        :
                        <button href="#" style={{ float: 'right' }}onClick={connectOnclick} >🔓️Connect Wallet</button>
                    }
                </div>
                <h1 style={{textAlign:"center",color:"sandybrown"}}>🍰Block Vote</h1>
                <div className="container">
                    <div style={{textAlign:"center"}}>

                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Candidate Name "
                    />

                    <input style={{marginLeft:"20px"}}
                        type="text"
                        id="studentID"
                        value={studentID}
                        onChange={(e) => setStudentID(e.target.value)}
                        placeholder="Enter Candidate StudentID"
                    />

                    <button onClick={addCandidate}>AddCandidate</button>
                    </div>
                    <br/>
                    <div style={{textAlign:"center"}}>
                        <input
                            type="text"
                            id="candidateID"
                            value={candidateID}
                            onChange={(e) => setCandidateID(e.target.value)}
                            placeholder="Enter CandidateID|eg:1"
                        />
                        <button onClick={getCandidate}>getCandidate</button>
                        <button onClick={getCandidateCount} style={{marginLeft:"20px"}}>Count</button>
                    </div>
                    <br/>
                    <div style={{textAlign:"center"}}>
                        <input
                            type="text"
                            id="candidateID"
                            value={candidateID}
                            onChange={(e) => setCandidateID(e.target.value)}
                            placeholder="Enter CandidateID to Vote"
                        />
                        <button onClick={voteCandidate}>Vote</button>
                        <button onClick={hasVoted} style={{marginLeft:"20px"}}>hasVoted</button>
                    </div>
                    <br/>
                </div>
                    <h4 style={{textAlign:'center',color:"grey"}}>The Vote Contract Address is <a href="https://www.oklink.com/zh-hans/sepolia-test/address/0x5836000c2af5a097b63579c64b6a77bd9fa7f290" style={{textDecoration:"none",color:"lightslategrey"}}>0x5836000c2AF5A097B63579C64B6A77bD9fa7f290</a></h4>
                    <h5 style={{color:"chocolate",textAlign:'center'}}>Read the doc🦊<a href="https://docs.metamask.io/wallet/">https://docs.metamask.io/wallet/</a></h5>
                    <h5 style={{color:"slateblue",textAlign:'center'}}>Ethers.js v6🍃<a href="https://docs.ethers.org/v6/">https://docs.ethers.org/v6/</a></h5>

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
                        max-width: 800px;
                        border-color: rgb(206, 229, 137);
                        line-height: 32px;
                        margin-right: 15px;
                      }

                      .container button {
                        padding: 9px 16px;
                        max-height: 36px;
                        border-color: #f3a284;
                        color: #eacd76;
                        background-color: white;
                        border-radius: 8px;
                        align-items: center;
                        font-size: 16px;
                        text-align: center;
                        font-weight: bold;
                        cursor: pointer;
                      }

                      .container {
                        border: 1px solid #eebb5e; /* 边框颜色 */
                        border-radius: 10px; /* 圆角大小 */
                        padding: 20px; /* 内边距 */
                        margin: 0 auto; /* 上下边距为0，左右自动，水平居中 */
                        width: fit-content; /* 宽度自适应内容 */
                      }

                    `}
                </style>
            </>
        )
}

export default Vote;
