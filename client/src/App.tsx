// import { Button, Checkbox, Col, Input, Layout, List, Row, Spin } from 'antd';
// import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
// import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { useEffect, useState } from 'react';
// import { AptosClient } from 'aptos';
// import { CheckboxChangeEvent } from 'antd/es/checkbox';


// type Task = {
//   address: string;
//   completed: boolean;
//   content: string;
//   task_id: string;
// };


// export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
// export const client = new AptosClient(NODE_URL);
// export const moduleAddress = "0da2178c68352cf9035afbb8750eb9eb6905332a9d0f15bd36b140cba6eaf5eb::todolist";


// const App = () => {

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState<string>("");
//   const [accountHasList, setAccountHasList] = useState<boolean>(false);
//   const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
//   const { account, signAndSubmitTransaction } = useWallet();


//   const onWriteTask = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setNewTask(value);
//   }

  
//   const fetchList = async () => {
//     if (!account) return [];

//     try {
//       const todoListResource = await client.getAccountResource(
//         account?.address,
//         `${moduleAddress}::todolist::TodoList`
//       );
//       setAccountHasList(true);

//       const tableHandle = (todoListResource as any).data.tasks.handle;

//       const taskCounter = (todoListResource as any).data.task_counter;

//       let tasks = [];
//       let counter = 1;

//       while (counter <= taskCounter) {
//         const tableItem = {
//           key_type: "u64",
//           value_type: `${moduleAddress}::todolist::Task`,
//           key: `${counter}`
//         };
//         const task = await client.getTableItem(tableHandle, tableItem);
//         tasks.push(task);
//         counter++;
//       }
//       setTasks(tasks);
//     } catch (error: any) {
//       setAccountHasList(false);
//     }
//   };
  
//   const addNewList = async () => {
//     if (!account) return [];
//     setTransactionInProgress(true);

//     const payload = {
//       type: "entry_function_payload",
//       function: `${moduleAddress}::todolist::creating_a_list`,
//       type_arguments: [],
//       arguments: [],
//     };

//     try {
//       const response = await signAndSubmitTransaction(payload);
//       await client.waitForTransaction(response.hash);
//       setAccountHasList(true);
//     } catch (error: any) {
//       setAccountHasList(false);
//     } finally {
//       setTransactionInProgress(false);
//     }
//   };

//   const onTaskAdded = async () => {
//     if (!account) return;
//     setTransactionInProgress(true);

//     const payload = {
//       type: "entry_function_payload",
//       function: `${moduleAddress}::todolist::creating_a_task`,
//       type_arguments: [],
//       arguments: [newTask],
//     };

//     const latestId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].task_id) + 1 : 1;

//     const newTaskToPush = {
//       address: account.address,
//       completed: false,
//       content: newTask,
//       task_id: latestId + "",
//     };

//     try {
//       const response = await signAndSubmitTransaction(payload);
//       await client.waitForTransaction(response.hash);
      
//       // Creating a new array
//       let newTasks = [...tasks];

//       newTasks.push(newTaskToPush);
//       setTasks(newTasks);
//       setNewTask("");
//     } catch (error: any) {
//       console.log("Error: ", error);
//     } finally {
//       setTransactionInProgress(false);
//     }
//   };

//   const onCheckboxChange = async (
//     event: CheckboxChangeEvent,
//     taskId: string
//   ) => {
//     if (!account) return;
//     if (!event.target.checked) return;
//     setTransactionInProgress(true);
    
//     const payload = {
//       type: "entry_function_payload",
//       function: `${moduleAddress}::todolist::completing_a_task`,
//       type_arguments: [],
//       arguments: [taskId],
//     };

//     try {
//       const response = await signAndSubmitTransaction(payload);
//       await client.waitForTransaction(response.hash);

//       setTasks((prevState) => {
//         const newState = prevState.map((obj) => {
//           if (obj.task_id == taskId) {
//             return { ...obj, completed: true };
//           }

//           return obj;
//         });
//         return newState;
//       });
//     } catch (error: any) {
//       console.log("error: ", error);
//     } finally {
//       setTransactionInProgress(false);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, [account?.address]);

    
//   return (
//     <>
//     <Layout>
//         <Row align="middle">
//           <Col span={10} offset={2}>
//             <h1>Todolist</h1>
//           </Col>
//           <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
//             <WalletSelector />
//           </Col>
//         </Row>
//       </Layout>
//       <Spin spinning={transactionInProgress}>
//         {!accountHasList ? (
//           <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
//             <Col span={8} offset={8}>
//               <Button
//                 disabled={!account}
//                 block
//                 onClick={addNewList}
//                 type="primary"
//                 style={{ height: "40px", backgroundColor: "#3f67ff" }}
//               >
//                 Add new List
//               </Button>
//             </Col>
//           </Row>
//         ) : (
//           <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
//             <Col span={8} offset={8}>
//               <Input.Group compact>
//                 <Input
//                   onChange={(event) => onWriteTask(event)}
//                   style={{ width: "calc(100% - 60px)" }}
//                   placeholder="Add a Task"
//                   size="large"
//                   value={newTask}
//                 />
//                 <Button
//                   onClick={onTaskAdded}
//                   type="primary"
//                   style={{ height: "40px", backgroundColor: "#3f67ff" }}
//                 >
//                   Add
//                 </Button>
//               </Input.Group>
//             </Col>
//             <Col span={8} offset={8}>
//               {tasks && (
//                 <List
//                   size="small"
//                   bordered
//                   dataSource={tasks}
//                   renderItem={(task: Task) => (
//                     <List.Item
//                       actions={[
//                         <div>
//                           {task.completed ? (
//                             <Checkbox defaultChecked={true} disabled />
//                           ) : (
//                             <Checkbox
//                               onChange={(event) =>
//                                 onCheckboxChange(event, task.task_id)
//                               }
//                             />
//                           )}
//                         </div>,
//                       ]}
//                     >
//                       <List.Item.Meta
//                         title={task.content}
//                         description={
//                           <a
//                             href={`https://explorer.aptoslabs.com/account/${task.address}/`}
//                             target="_blank"
//                           >{`${task.address.slice(0, 6)}...${task.address.slice(
//                             -5
//                           )}`}</a>
//                         }
//                       />
//                     </List.Item>
//                   )}
//                 />
//               )}
//             </Col>
//           </Row>
//         )}
//       </Spin>       
//     </>
//   )
  
// }

// export default App




import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, List, Checkbox, Input } from "antd";

import React, { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};

const aptosConfig = new AptosConfig({ network: Network.DEVNET });

export const aptos = new Aptos(aptosConfig);
// change this to be your module account address
export const moduleAddress = "0x6b8e84008df2e809a2b6b984d5dc7ba36b5e3669b5ba741782b4a975de4827b7";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const onWriteTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewTask(value);
  };

  const fetchList = async () => {
    if (!account) return [];
    try {
      const todoListResource = await aptos.getAccountResource(
        {accountAddress:account?.address,
          resourceType:`${moduleAddress}::todolist::TodoList`}
      );
      setAccountHasList(true);
      // tasks table handle
      const tableHandle = (todoListResource as any).data.tasks.handle;
      // tasks table counter
      const taskCounter = (todoListResource as any).data.task_counter;

      let tasks = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::todolist::Task`,
          key: `${counter}`,
        };
        const task = await aptos.getTableItem<Task>({handle:tableHandle, data:tableItem});
        tasks.push(task);
        counter++;
      }
      // set tasks in local state
      setTasks(tasks);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::todolist::creating_a_list`,
        functionArguments:[]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onTaskAdded = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::todolist::creating_a_task`,
        functionArguments:[newTask]
      }
    }

    // hold the latest task.task_id from our local state
    const latestId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].task_id) + 1 : 1;

    // build a newTaskToPush objct into our local state
    const newTaskToPush = {
      address: account.address,
      completed: false,
      content: newTask,
      task_id: latestId + "",
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});

      // Create a new array based on current state:
      let newTasks = [...tasks];

      // Add item to the tasks array
      newTasks.push(newTaskToPush);
      // Set state
      setTasks(newTasks);
      // clear input text
      setNewTask("");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onCheckboxChange = async (event: CheckboxChangeEvent, taskId: string) => {
    if (!account) return;
    if (!event.target.checked) return;
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::todolist::completed_the_task`,
        functionArguments:[taskId]
      }
    }

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});

      setTasks((prevState) => {
        const newState = prevState.map((obj) => {
          // if task_id equals the checked taskId, update completed property
          if (obj.task_id === taskId) {
            return { ...obj, completed: true };
          }

          // otherwise return object as is
          return obj;
        });

        return newState;
      });
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Todolist</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
        {!accountHasList ? (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              <Button
                disabled={!account}
                block
                onClick={addNewList}
                type="primary"
                style={{ height: "40px", backgroundColor: "#3f67ff" }}
              >
                Add new List
              </Button>
            </Col>
          </Row>
        ) : (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              <Input.Group compact>
                <Input
                  onChange={(event) => onWriteTask(event)}
                  style={{ width: "calc(100% - 60px)" }}
                  placeholder="Add a Task"
                  size="large"
                  value={newTask}
                />
                <Button onClick={onTaskAdded} type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                  Add
                </Button>
              </Input.Group>
            </Col>
            <Col span={8} offset={8}>
              {tasks && (
                <List
                  size="small"
                  bordered
                  dataSource={tasks}
                  renderItem={(task: Task) => (
                    <List.Item
                      actions={[
                        <div>
                          {task.completed ? (
                            <Checkbox defaultChecked={true} disabled />
                          ) : (
                            <Checkbox onChange={(event) => onCheckboxChange(event, task.task_id)} />
                          )}
                        </div>,
                      ]}
                    >
                      <List.Item.Meta
                        title={task.content}
                        description={
                          <a
                            href={`https://explorer.aptoslabs.com/account/${task.address}/`}
                            target="_blank"
                          >{`${task.address.slice(0, 6)}...${task.address.slice(-5)}`}</a>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
}

export default App;