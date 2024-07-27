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
  Upload,
  Image,
} from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import TextArea from "antd/lib/input/TextArea";
import BigNumber from "bignumber.js";
const Context = React.createContext({
  name: "Default",
});

function Tasks() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [searchTask, setSearchTask] = useState("");
  const [filteredTaskData, setfilteredTaskData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [newTaskModalOpen, setNewScriptModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [modalTitle, setModalTitle] = useState("");
  const [deleteScriptModalOpen, setDeleteScriptModalOpen] = useState("");
  const [currentSelectedTask, setCurrentSelectedTask] = useState([]);
  const [taskBonus, setTaskBonus] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageFile, setImageFile] = useState();
  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }
    getTasks();
  }, []);

  const getTasks = () => {
    setIsLoading(true);
    axios
      .get(`${backend_api}/task`)
      .then((response) => {
        if (response.status == 200) {
          console.log("Scripts", response.data);
          if (response.data.success) {
            console.log(response.data.message[0]);
            setfilteredTaskData(response.data.message);
            setTaskData(response.data.message);
          } else
            api.info({
              message: `Server Error`,
              description: (
                <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearTaskForm = () => {
    setTaskName("");
    setTaskBonus("");
    setImageFile();
    setImageUrl("");
  };

  const handleCancel = () => {
    setNewScriptModalOpen(false);
    setDeleteScriptModalOpen(false);
    clearTaskForm();
  };

  const handleSaveNewTask = () => {
    if (taskBonus == "" || taskName == "" || !imageFile) {
      notification.info({
        message: "Info",
        description: "Input correctly",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image_url", imageFile);
    formData.append("name", taskName);
    formData.append(
      "bonus",
      new BigNumber(taskBonus)
        .multipliedBy(new BigNumber(1000000000))
        .toString()
    );

    axios
      .post(`${backend_api}/task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          if (response.data.success) {
            notification.success({
              message: "Success",
              description: "Successfully Created",
            });
            getTasks();
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
        clearTaskForm();
      });
  };

  const handleSearchTasksChange = (e) => {
    setSearchTask(e.target.value);
    const searchKey = e.target.value;
    filterDataAsync(taskData, searchKey).then((filteredData) => {
      setfilteredTaskData(filteredData);
    });
  };

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(key.toLowerCase()));
      resolve(filteredData);
    });
  };

  const handleDeleteButton = (record) => {
    setDeleteScriptModalOpen(true);
    setCurrentSelectedTask(record);
  };

  const handleDeleteScript = () => {
    axios
      .delete(`${backend_api}/task/${currentSelectedTask.id}`)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success) {
            notification.success({
              message: "Success",
              description: "Script deleted",
            });
            getTasks();
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

  const task_columns = [
    {
      title: "Thumbnail",
      dataIndex: "image_url",
      key: "image_url",
      render(data) {
        return (
          <Row justify="center">
            <img
              src={`${process.env.REACT_APP_BACKEND}/uploads/${data}`}
              alt="task image"
              style={{ width: "100px", height: "100px" }}
            />
          </Row>
        );
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "120px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      textWrap: "word-break",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "Bonus TH",
      dataIndex: "bonus",
      key: "bonus",
      textWrap: "word-break",
      ellipsis: true,
      width: "35%",
      render: (bonus, record) => {
        return (
          <Space size="small">
            <div style={{ whiteSpace: "wrap", width: "100px" }}>
              {new BigNumber(bonus).div(new BigNumber(1000000000)).toString()}{" "}
              th/s
            </div>
          </Space>
        );
      },
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
      width: "70px",
      align: "top",
    },
  ];

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleChange = (info) => {};
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const beforeUpload = async (file) => {
    setImageFile(file);
    getBase64(file)
      .then((url) => {
        setImageLoading(false);
        setImageUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
    return false;
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Tasks">
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col md={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setNewScriptModalOpen(true);
                      setModalTitle("Add New Task");
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
                    value={searchTask}
                    onChange={(e) => handleSearchTasksChange(e)}
                  />
                </Col>
              </Row>
              <Table
                columns={task_columns}
                dataSource={filteredTaskData}
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
          visible={newTaskModalOpen}
          onOk={handleSaveNewTask}
          confirmLoading={isLoading}
          onCancel={handleCancel}
          width={1000}
        >
          <Row justify="center" style={{ textAlign: "center" }}>
            <Upload
              name="avatar"
              className="avatar-uploader"
              showUploadList={false}
              action={backend_api}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              listType="picture-card"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Row>
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Form layout="vertical" className="row-col">
                <Row style={{ marginBottom: "20px" }} gutter={50}>
                  <Col span={12}>
                    <p>Name</p>
                    <Input
                      placeholder="Script Title"
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                      value={taskName}
                    />
                  </Col>
                  <Col span={12}>
                    <p>Bonus</p>
                    <Input
                      placeholder="150"
                      onChange={(e) => {
                        setTaskBonus(e.target.value);
                      }}
                      value={taskBonus}
                      type="number"
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Delete Task"
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

export default Tasks;
