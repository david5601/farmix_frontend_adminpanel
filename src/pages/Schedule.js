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
  Select,
  TimePicker,
  DatePicker,
} from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

// Extend dayjs with the weekday plugin
dayjs.extend(weekday);
dayjs.extend(localeData);

const Context = React.createContext({
  name: "Default",
});

function Schedule() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleDataLoading, setScheduleDataLoading] = useState(false);
  const [searchLawFirm, setSearchLawFirm] = useState("");
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [newLeadModalOpen, setNewScheduleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [title, setTitle] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deleteLeadModalOpen, setDeleteLeadModalOpen] = useState("");
  const [currentSelectedLead, setCurrentSelectedLead] = useState([]);
  const [scriptData, setScriptData] = useState([]);
  const [currentSelectedScheduleType, setCurrentSelectedScheduleType] =
    useState(1);

  const [scheduleTime, setScheduleTime] = useState("");
  const [currentSelectedSchedule, setCurrentSelectedSchedule] = useState();
  const [lawFirmData, setLawFirmData] = useState();
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [wholeLawFirmData, setWholeLawFirmData] = useState([]);
  const [wholeFilteredLawFirmData, setWholeFilteredLawFirmData] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }
    getSchedules();
    getScripts();
    getLeads();
  }, []);

  const getLeads = () => {
    axios
      .get(`${backend_api}/lead?user=${user.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          if (response.data.success) {
            setWholeLawFirmData(response.data.message);
            const updatedData = response.data.message.map(item => ({
              ...item,
              lead_id: item.id
            }));
            
            setWholeFilteredLawFirmData(updatedData);
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
      .finally(() => {});
  };
  const getScripts = () => {
    axios
      .get(`${backend_api}/script?user_id=${user.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log("Scripts", response.data);
          if (response.data.success) {
            console.log(response.data.message[0]);
            let tempScripts = [];
            response.data.message.forEach((script) => {
              tempScripts.push({
                ...script,
                value: script.id,
                label: script.title,
              });
            });
            setScriptData(tempScripts);
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
      });
  };
  const getSchedules = () => {
    setScheduleDataLoading(true);
    axios
      .get(`${backend_api}/schedule?user=${user.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log("response.data", response.data);
          if (response.data.success) {
            setScheduleData(response.data.message);
            setFilteredScheduleData(response.data.message);
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
        setScheduleDataLoading(false);
        setNewScheduleModalOpen(false);
      });
  };

  const clearLeadForm = () => {};

  const handleCancel = () => {
    setNewScheduleModalOpen(false);
    setDeleteLeadModalOpen(false);
    clearLeadForm();
  };

  const handleSaveNewSchedule = () => {
    
    if (title == "" || lawFirmData.length == 0 || scheduleTime == "") {
      notification.info({
        message: "Input correctly",
        description: "Some fields are missing.",
      });
      return;
    }

    setIsLoading(true);
    if (modalTitle == "Add New Schedule") {
      lawFirmData.forEach((element) => {
        const request = {
          user_id: user.id,
          title: title,
          lead_id: element.id,
          script_id: currentSelectedScheduleType,
          date: scheduleTime,
        };

        axios
          .post(`${backend_api}/schedule`, request)
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data);
              if (response.data.success) {
                notification.success({
                  message: "Success",
                  description: "Successfully Created",
                });
                getSchedules();
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
            notification.error({
              message: "Error",
              description: "Server Error",
            });
          })
          .finally(() => {
            setIsLoading(false);
            setNewScheduleModalOpen(false);
            clearLeadForm();
          });
      });
    } else {
      axios
      .delete(`${backend_api}/schedule?title=${currentSelectedSchedule.title}`)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success) {
            lawFirmData.forEach((element) => {
              
              const request = {
                user_id: user.id,
                title: title,
                lead_id: element.lead_id,
                script_id: currentSelectedScheduleType,
                date: scheduleTime,
              };
      
              axios
                .post(`${backend_api}/schedule`, request)
                .then((response) => {
                  if (response.status == 200) {
                    console.log(response.data);
                    if (response.data.success) {
                      notification.success({
                        message: "Success",
                        description: "Successfully Created",
                      });
                      getSchedules();
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
                  notification.error({
                    message: "Error",
                    description: "Server Error",
                  });
                })
                .finally(() => {
                  setIsLoading(false);
                  setNewScheduleModalOpen(false);
                  clearLeadForm();
                });
            });
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
        setDeleteLeadModalOpen(false);
      });

     
    }
  };

  const handleSearchLawFirmChange = (e) => {
    setSearchLawFirm(e.target.value);
    const searchKey = e.target.value;
    filterDataAsync(scheduleData, searchKey).then((filteredData) => {
      setFilteredScheduleData(filteredData);
    });
  };

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter((item) =>
        item.title?.toLowerCase().includes(key.toLowerCase())
      );
      resolve(filteredData);
    });
  };

  const handleDetailButton = (schedule) => {
    setModalTitle("Detail Schedule");
    console.log("lead", schedule);

    setCurrentSelectedScheduleType(
      scriptData.find((script) => script.title == schedule.script_title).value
    );
    setCurrentSelectedSchedule(schedule);
    setTitle(schedule.title);
    setNewScheduleModalOpen(true);
    setScheduleTime(schedule.date);
    axios
      .get(
        `${backend_api}/schedule_detail?title=${encodeURIComponent(
          schedule.title
        )}&user_id=${encodeURIComponent(user.id)}`
      )
      .then((res) => {
        if (res.data.success) {
          setLawFirmData(res.data.message);
        } else {
          notification.error({
            message: "Error",
            description: res.data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteButton = (record) => {
    setDeleteLeadModalOpen(true);
    setCurrentSelectedSchedule(record);
  };

  const handleRemoveButton = (record) => {
    console.log(record, lawFirmData)
    setLawFirmData(lawFirmData.filter(item => item.id != record.id))
  }

  const handleDeleteSchedule = () => {
    axios
      .delete(`${backend_api}/schedule?title=${currentSelectedSchedule.title}`)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success) {
            notification.success({
              message: "Success",
              description: "Schedule deleted",
            });
            getSchedules();
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
        setDeleteLeadModalOpen(false);
      });
  };

  const handleScheduleChange = (value) => {
    setCurrentSelectedScheduleType(value);
  };

  const handleAddLeadsClick = (value) => {
    setAddLeadModalOpen(true);
  };

  const handleAddLead = () => {
    setAddLeadModalOpen(false);
  };

  const handleAddLeadCancel = (value) => {
    setAddLeadModalOpen(false);
    setSelectedLeads([]);
  };
  const schedule_columns = [
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
      title: "Leads",
      dataIndex: "leads_count",
      key: "leads_count",
      width: "100px",
    },
    {
      title: "Script",
      dataIndex: "script_title",
      key: "script_title",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Schedule Time",
      dataIndex: "date",
      key: "date",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data.substring(0, 16)}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
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
      width: "100px",
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
      width: "100px",
    },
  ];
  const lead_firm_columns = [
    {
      title: "Company Name",
      dataIndex: "law_firm_name",
      key: "law_firm_name",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "200px",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "100px",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Person",
      dataIndex: "person_name",
      key: "person_name",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Title",
      dataIndex: "person_title",
      key: "person_title",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Remove",
      render(_, record) {
        return (
          <div>
            <Button
              type="link"
              danger
              onClick={(e) => handleRemoveButton(record)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];
  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  const law_firm_columns = [
    {
      title: "Company Name",
      dataIndex: "law_firm_name",
      key: "law_firm_name",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "200px",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "100px",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Person",
      dataIndex: "person_name",
      key: "person_name",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Title",
      dataIndex: "person_title",
      key: "person_title",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Website",
      dataIndex: "site",
      key: "site",
      render: (link) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "50px" }}>
            <a href={link} target="_blank" style={{ whiteSpace: "pre-wrap" }}>
              Visit
            </a>
          </div>
        );
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Company",
      dataIndex: "person_linkedin_url",
      key: "person_linkedin_url",
      render: (link) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "50px" }}>
            <a href={link} target="_blank" style={{ whiteSpace: "pre-wrap" }}>
              Visit
            </a>
          </div>
        );
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Personal",
      dataIndex: "person_linkedin_url",
      key: "person_linkedin_url",
      render: (link) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "50px" }}>
            <a href={link} target="_blank" style={{ whiteSpace: "pre-wrap" }}>
              Visit
            </a>
          </div>
        );
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
  ];
  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Schedules">
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col md={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setNewScheduleModalOpen(true);
                      setModalTitle("Add New Schedule");
                      setCurrentSelectedSchedule({
                        title: "",
                        script_title: "",
                      });
                      setCurrentSelectedScheduleType(scriptData[0]?.value);
                      setTitle("");
                      setLawFirmData([]);
                      setScheduleTime("");
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
                    onChange={(e) => handleSearchLawFirmChange(e)}
                  />
                </Col>
              </Row>
              <Table
                columns={schedule_columns}
                dataSource={filteredScheduleData}
                scroll={{ x: true }}
                rowKey={(record) => record.title}
                loading={scheduleDataLoading}
                pagination={false}
                bordered
                size="small"
              />
            </Card>
          </Col>
        </Row>
        <Modal
          title={modalTitle}
          visible={newLeadModalOpen}
          onOk={handleSaveNewSchedule}
          confirmLoading={isLoading}
          onCancel={handleCancel}
          width={1000}
        >
          <Row justify="center">
            <Col span={24}>
              <Form layout="vertical" className="row-col">
                <Row style={{ marginBottom: "20px" }} gutter={50}>
                  <Col span={12}>
                    <p>Title</p>
                    <Input
                      placeholder="Title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      value={title}
                      defaultValue={title}
                    />
                  </Col>
                  <Col span={12}>
                    <p>Script</p>
                    <Select
                      defaultValue={
                        modalTitle == "Add New Schedule"
                          ? scriptData[0]?.value
                          : currentSelectedScheduleType
                      }
                      value={currentSelectedScheduleType}
                      onChange={handleScheduleChange}
                      options={scriptData}
                      style={{ width: "100%" }}
                      size="large"
                    ></Select>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Row
                      justify="space-between"
                      align="bottom"
                      style={{ margin: "20px" }}
                    >
                      <p>Leads</p>
                      <Button
                        size="small"
                        type="primary"
                        onClick={handleAddLeadsClick}
                      >
                        Add
                      </Button>
                    </Row>
                    <Table
                      columns={lead_firm_columns}
                      dataSource={lawFirmData}
                      scroll={{ x: true }}
                      rowKey={(record) => record.id}
                      loading={scheduleDataLoading}
                      pagination={false}
                      bordered
                      size="small"
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                  <Row gutter={10}>
                    <Col span={24}>
                      <p>Date</p>
                      <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        onChange={(_, dateString) => {
                          setScheduleTime(`${dateString}:00`);
                        }}
                        value={
                          modalTitle == "Add New Schedule"
                            ? undefined
                            : dayjs(scheduleTime)
                        }
                        allowClear={false}
                        format="YYYY-MM-DD HH:mm"
                      />
                    </Col>
                  </Row>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Add Leads"
          visible={addLeadModalOpen}
          onOk={handleAddLead}
          confirmLoading={isLoading}
          onCancel={handleAddLeadCancel}
          width={1000}
        >
          <Row justify="center">
            <Col span={24}>
              <Form layout="vertical" className="row-col">
                <Row>
                  <Col span={24}>
                    <Table
                      columns={law_firm_columns}
                      dataSource={wholeFilteredLawFirmData}
                      scroll={{ x: true }}
                      rowKey={(record) => record.id}
                      loading={scheduleDataLoading}
                      pagination={false}
                      bordered
                      rowSelection={{
                        type: "checkbox",
                        onChange: (selectedRowKeys, selectedRows) => {
                          console.log(
                            `selectedRowKeys: ${selectedRowKeys}`,
                            "selectedRows: ",
                            selectedRows
                          );

                          setLawFirmData(selectedRows);
                        },
                        getCheckboxProps: (record) => ({
                          disabled: record.name === "Disabled User",
                          // Column configuration not to be checked
                          name: record.name,
                        }),
                        selectedRowKeys: lawFirmData?.map((row) => row.id),
                      }}
                      size="small"
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Delete Schedule"
          visible={deleteLeadModalOpen}
          onOk={handleDeleteSchedule}
          confirmLoading={isLoading}
          onCancel={handleCancel}
        >
          <h3>Are you sure?</h3>
        </Modal>
      </div>
    </Context.Provider>
  );
}

export default Schedule;
