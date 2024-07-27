// /*!
// =========================================================
// * Muse Ant Design Dashboard - v1.0.0
// =========================================================
// * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
// * Copyright 2021 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
// * Coded by Creative Tim
// =========================================================
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
// import { render } from "@testing-library/react";
// import {
//   Row,
//   Col,
//   Card,
//   Radio,
//   Table,
//   Upload,
//   message,
//   Progress,
//   Button,
//   Avatar,
//   Typography,
//   Input,
//   Tag,
//   Space,
//   notification,
//   Modal,
// } from "antd";
// import axios from "axios";
// import { useSelector, useDispatch } from 'react-redux';
// import { useHistory } from "react-router-dom";
// import React, { useState, useEffect, useMemo } from "react";
// import { backend_api } from "../config";

// const { TextArea } = Input;

// const Context = React.createContext({
//   name: "Default",
// });

// function Scripts() {
//   const [openModal, setopenModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [api, contextHolder] = notification.useNotification();
//   const [scripts, setScripts] = useState([]);
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const [script, setScript] = useState('');
//   const [isAdd, setIsAdd] = useState(false);
//   const user = useSelector((state) => state.auth.user);
//   const history = useHistory();

//   useEffect(() => {
//     if (user == null) {
//       history.push("/")
//       return
//     }
//     axios
//       .get(`${backend_api}/script?user_id=${user.id}`)
//       .then((response) => {
//         if (response.status == 200) {
//           console.log("Scripts", response.data);
//           if (response.data.success) {
//             console.log(response.data.message[0])
//             setScripts(response.data.message[0].script);
//             setIsAdd(response.data.message[0].length == 0);
//           }
//           else
//             api.info({
//               message: `Server Error`,
//               description: (
//                 <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//               ),
//               placement: "topRight",
//             });
//         } else {
//           api.info({
//             message: `Server Error`,
//             description: (
//               <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//             ),
//             placement: "topRight",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const handleOk = (e) => {
//     setopenModal(false);
//   };

//   const handleCancel = (e) => {
//     setopenModal(false);
//     setOpenEditModal(false);
//     setOpenAddModal(false);
//   };

//   const handleCategoryChange = (e) => {
//   };
//   const handlePromptChange = (e) => {
//   };

//   const handleEditOk = () => {
//     let data = {
//       Prompt: prompt,
//     };
//     axios
//       .post(`${backend_api}/edit_script`, data)
//       .then((response) => {
//         console.log(response);
//         if (response.status === 200) {
//           axios
//             .get(`${backend_api}/get_scripts`)
//             .then((response) => {
//               if (response.status == 200) {
//                 console.log("Law", response.data.data);
//                 setScripts(response.data.data);
//                 api.success({
//                   message: `Success`,
//                   description: (
//                     <Context.Consumer>
//                       {({ }) => `Updated successfully`}
//                     </Context.Consumer>
//                   ),
//                   placement: "topRight",
//                 });
//               } else {
//                 api.info({
//                   message: `Edit Failed`,
//                   description: (
//                     <Context.Consumer>
//                       {({ }) => `Error Occured`}
//                     </Context.Consumer>
//                   ),
//                   placement: "topRight",
//                 });
//               }
//               setOpenEditModal(false);
//             })
//             .catch((error) => {
//               console.log(error);
//             });
//         } else {
//           api.info({
//             message: `Error`,
//             description: (
//               <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//             ),
//             placement: "topRight",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleAddClick = () => {
//     setButtonLoading(true)
//     let script = {
//       user_id: user.id,
//       script: scripts
//     }
//     axios
//       .post(`${backend_api}/script`, script)
//       .then((response) => {
//         if (response.status == 200) {
//           console.log("Scripts", response.data);
//           if (response.data.success) {
//             console.log(response.data.message)
//             setScripts(response.data.message.script);
//           }
//           else
//             api.info({
//               message: `Server Error`,
//               description: (
//                 <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//               ),
//               placement: "topRight",
//             });
//         } else {
//           api.info({
//             message: `Server Error`,
//             description: (
//               <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//             ),
//             placement: "topRight",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       }).finally(() => {
//         setButtonLoading(false)
//       });

//   }

//   const handleAddOk = () => {
//     if (!prompt)
//       api.info({
//         message: `Input Error`,
//         description: (
//           <Context.Consumer>
//             {({ }) => `Input category & Prompt correctly`}
//           </Context.Consumer>
//         ),
//         placement: "topRight",
//       });
//     let data = {
//       Prompt: prompt
//     };
//     axios
//       .post(`${backend_api}/add_script`, data)
//       .then((response) => {
//         console.log(response);
//         if (response.status === 200) {
//           axios
//             .get(`${backend_api}/get_scripts`)
//             .then((response) => {
//               if (response.status == 200) {
//                 console.log("Law", response.data.data);
//                 setScripts(response.data.data);
//                 api.success({
//                   message: `Success`,
//                   description: (
//                     <Context.Consumer>
//                       {({ }) => `Updated successfully`}
//                     </Context.Consumer>
//                   ),
//                   placement: "topRight",
//                 });
//               } else {
//                 api.info({
//                   message: `Edit Failed`,
//                   description: (
//                     <Context.Consumer>
//                       {({ }) => `Error Occured`}
//                     </Context.Consumer>
//                   ),
//                   placement: "topRight",
//                 });
//               }
//               setOpenEditModal(false);
//             })
//             .catch((error) => {
//               console.log(error);
//             });
//         } else {
//           api.info({
//             message: `Error`,
//             description: (
//               <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
//             ),
//             placement: "topRight",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     setOpenAddModal(false);

//   };
//   const contextValue = useMemo(
//     () => ({
//       name: "Ant Design",
//     }),
//     []
//   );
//   return (
//     <Context.Provider value={contextValue}>
//       {contextHolder}
//       <div className="layout-content">
//         <Row>
//           <Col span={24}>
//             <Card title="Script">
//               <TextArea
//                 placeholder="I visited your website, johnlaw.com and saw that you website loads slowly..."
//                 onChange={(e) => { setScripts(e.target.value) }}
//                 value={scripts}
//                 defaultValue={scripts}
//                 rows={20}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <Row justify="end" style={{ marginTop: "20px" }}>
//           <Button
//             type="primary"
//             style={{ marginRight: "10px" }}
//             onClick={() => {
//               handleAddClick();
//             }}
//             loading={buttonLoading}
//           >
//             {isAdd ? 'Add' : 'Modify'}
//           </Button>
//         </Row>
//         <Modal
//           title="Confirm"
//           visible={openModal}
//           onOk={handleOk}
//           onCancel={handleCancel}
//         >
//           <p>Are you sure?</p>
//         </Modal>

//         <Modal
//           title={"Edit"}
//           visible={openEditModal}
//           onOk={handleEditOk}
//           onCancel={handleCancel}
//         >
//           <Typography.Title level={5}>Category</Typography.Title>
//           <Input
//             placeholder="Input your category"
//           />
//           <div style={{ marginBottom: "20px" }}></div>
//           <Typography.Title level={5}>Prompt</Typography.Title>
//           <TextArea
//             placeholder="Input your prompt"
//             autoSize={{
//               minRows: 2,
//             }}
//             value={prompt}
//             onChange={handlePromptChange}
//           />
//         </Modal>

//         <Modal
//           title={"Add"}
//           visible={openAddModal}
//           onOk={handleAddOk}
//           onCancel={handleCancel}
//         >
//           <Typography.Title level={5}>Category</Typography.Title>
//           <Input
//             placeholder="Input your category"
//           />
//           <div style={{ marginBottom: "20px" }}></div>
//           <Typography.Title level={5}>Prompt</Typography.Title>
//           <TextArea
//             placeholder="Input your prompt"
//             autoSize={{
//               minRows: 2,
//               maxRows: 16,
//             }}
//             value={prompt}
//             onChange={handlePromptChange}
//           />
//         </Modal>

//       </div>
//     </Context.Provider>
//   );
// }

// export default Scripts;

/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useEffect, useState, useMemo } from "react";

import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  notification,
  Form,
  Modal,
} from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import TextArea from "antd/lib/input/TextArea";

const Context = React.createContext({
  name: "Default",
});

function Scripts() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [searchLawFirm, setSearchLawFirm] = useState("");
  const [filteredScriptData, setfilteredScriptData] = useState([]);
  const [scriptData, setScriptData] = useState([]);
  const [newScriptModalOpen, setNewScriptModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [scriptTitle, setScriptTitle] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [currentScript, setCurrentScript] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deleteScriptModalOpen, setDeleteScriptModalOpen] = useState("");
  const [currentSelectedScript, setCurrentSelectedScript] = useState([]);
  const [currentSMS, setCurrentSMS] = useState("");
  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }
    getScripts();
  }, []);

  const getScripts = () => {
    setIsLoading(true);
    axios
      .get(`${backend_api}/script?user_id=${user.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log("Scripts", response.data);
          if (response.data.success) {
            console.log(response.data.message[0])
            setfilteredScriptData(response.data.message);
            setScriptData(response.data.message);
            setIsAdd(response.data.message.length == 0);
          }
          else
            api.info({
              message: `Server Error`,
              description: (
                <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
              ),
              placement: "topRight",
            });
        } else {
          api.info({
            message: `Server Error`,
            description: (
              <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false)
      });
  };

  const clearScriptForm = () => {
    setScriptTitle("");
    setCurrentScript("");
    setCurrentSMS("");
  };

  const handleCancel = () => {
    setNewScriptModalOpen(false);
    setDeleteScriptModalOpen(false);
    clearScriptForm();
  };

  const handleSaveNewScript = () => {
    if(currentSMS == '' && currentScript == '') {
      notification.info({
        message: "Info",
        description: "SMS and Script fields are missing."
      })
      return;
    }
    const request = {
      title: scriptTitle,
      script: currentScript,
      user_id: user.id,
      sms: currentSMS
    };
    setIsLoading(true);
    if (modalTitle == "Add New Script") {
      axios
        .post(`${backend_api}/script`, request)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            if (response.data.success) {
              notification.success({
                message: "Success",
                description: "Successfully Created",
              });
              getScripts();
            } else {
              notification.error({
                message: "Error",
                description: response.data.message,
              });
            }
          } else {
            notification.error({
              message: "Error",
              description: "Server Error",
            });
          }
        })
        .catch((error) => {
          notification.error({ message: "Error", description: "Server Error" });
        })
        .finally(() => {
          setIsLoading(false);
          setNewScriptModalOpen(false);
          clearScriptForm();
        });
    } else {
      axios
        .put(`${backend_api}/script/${currentSelectedScript.id}`, request)
        .then((response) => {
          if (response.status == 200) {
            console.log({data: response});
            if (response.data.success) {
              notification.success({
                message: "Success",
                description: "Successfully Updated",
              });
              getScripts();
            } else {
              notification.error({
                message: "Error",
                description: response.data.message,
              });
            }
          } else {
            notification.error({
              message: "Error",
              description: "Server Error",
            });
          }
        })
        .catch((error) => {
          notification.error({ message: "Error", description: "Server Error" });
        })
        .finally(() => {
          setIsLoading(false);
          setNewScriptModalOpen(false);
          clearScriptForm();
        });
    }
  };

  const handleSearchScriptsChange = (e) => {
    setSearchLawFirm(e.target.value);
    const searchKey = e.target.value;
    filterDataAsync(scriptData, searchKey).then((filteredData) => {
      setfilteredScriptData(filteredData);
    });
  };

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(key.toLowerCase()) ||
          item.script?.toLowerCase().includes(key.toLowerCase())
          
      );
      resolve(filteredData);
    });
  };

  const handleDetailButton = (script) => {
    setModalTitle("Detail Script");
    setCurrentSelectedScript(script);
    setScriptTitle(script.title);
    setCurrentSMS(script.sms);
    setCurrentScript(script.script);
    setNewScriptModalOpen(true);
  };

  const handleDeleteButton = (record) => {
    setDeleteScriptModalOpen(true);
    setCurrentSelectedScript(record);
  };

  const handleDeleteScript = () => {
    axios
      .delete(`${backend_api}/script/${currentSelectedScript.id}`)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success) {
            notification.success({
              message: "Success",
              description: "Script deleted",
            });
            getScripts();
          } else {
            notification.error({
              message: "Error",
              description: response.data.message,
            });
          }
        } else {
          notification.error({ message: "Error", description: "Server Error" });
        }
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Server Error" });
      })
      .finally(() => {
        setIsLoading(false);
        setDeleteScriptModalOpen(false);
      });
  };

  const script_columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "200px",
    },
    {
      title: "Script",
      dataIndex: "script",
      key: "script",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap",overflow: 'hidden', textOverflow: 'ellipsis' }}>{data < 200? data : data.slice(0, 200) + "..."}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "SMS",
      dataIndex: "sms",
      key: "sms",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap",overflow: 'hidden', textOverflow: 'ellipsis' }}>{data < 200? data : data.slice(0, 200) + "..."}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "View",
      render(_, record) {
        return (
          <div>
            <Button type="link" onClick={(e) => handleDetailButton(record)}>
              Detail
            </Button>
          </div>
        );
      },
      width: '100px'
    },
    {
      title: "Delete",
      render(_, record) {
        return (
          <div>
            <Button
              type="link"
              danger
              onClick={(e) => handleDeleteButton(record)}
            >
              Delete
            </Button>
          </div>
        );
      },
      width: '70px',
      align: 'top'

    },
  ];

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Scripts">
              <Row justify="space-between" style={{marginBottom: '10px'}}>
                <Col md={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setNewScriptModalOpen(true);
                      setModalTitle("Add New Script");
                    }}
                  >
                    <PlusOutlined />
                    Add New
                  </Button>
                </Col>
                <Col md={6}>
                  <Input
                    prefix={<SearchOutlined />}
                    size="small"
                    placeholder="Search"
                    value={searchLawFirm}
                    onChange={(e) => handleSearchScriptsChange(e)}
                  />
                </Col>
              </Row>
              <Table
                columns={script_columns}
                dataSource={filteredScriptData}
                scroll={{ x: true }}
                rowKey={(record) => record.id}
                loading={isLoading}
                pagination={false}
                bordered
                size="small"
              />
            </Card>
          </Col>
        </Row>
        <Modal
          title={modalTitle}
          visible={newScriptModalOpen}
          onOk={handleSaveNewScript}
          confirmLoading={isLoading}
          onCancel={handleCancel}
          width={1000}
        >
          <Row justify="center">
            <Col span={24}>
              <Form layout="vertical" className="row-col">
                <Row style={{ marginBottom: "20px" }} gutter={50}>
                  <Col span={24}>
                    <p>Title</p>
                    <Input
                      placeholder="Script Title"
                      onChange={(e) => {
                        setScriptTitle(e.target.value);
                      }}
                      value={scriptTitle}
                      defaultValue={scriptTitle}
                    />
                  </Col>
                 
                </Row>
                
                <Row style={{ marginBottom: "20px" }}>
                  <Col span={24}>
                    <p>Script</p>
                    <TextArea
                      placeholder="I visited your website, johnlaw.com and saw that you website loads slowly..."
                      onChange={(e) => {
                        setCurrentScript(e.target.value);
                      }}
                      value={currentScript}
                      defaultValue={currentScript}
                      rows={15}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <p>SMS</p>
                    <TextArea
                      placeholder="Hello I hope that mail found you well."
                      onChange={(e) => {
                        setCurrentSMS(e.target.value);
                      }}
                      value={currentSMS}
                      defaultValue={currentSMS}
                      rows={5}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Delete Script"
          visible={deleteScriptModalOpen}
          onOk={handleDeleteScript}
          confirmLoading={isLoading}
          onCancel={handleCancel}
        >
          <h3>Are you sure?</h3>
        </Modal>
      </div>
    </Context.Provider>
  );
}

export default Scripts;
