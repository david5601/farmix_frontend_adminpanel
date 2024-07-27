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
import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Card,
  Col,
  Row,
  Input,
  Typography,
  Button,
  Select,
  notification,
  Modal
} from "antd";
import axios from "axios";
import { backend_api } from "../config";

const { TextArea } = Input;

const Context = React.createContext({
  name: 'Default',
});

function Mail() {

  const [mail, setMail] = useState();
  const [mails, setMails] = useState([]);
  const [defaultMailValue, setDefaultMailValue] = useState('');
  const [fromMail, setFromMail] = useState()
  const [mailContent, setMailContent] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMailContent, setNewMailContent] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const [isCompared, setIsCompared] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMailLoading, setAddMailLoading] = useState(false);
  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState();
  const mailFromServer = useRef('');

  useEffect(() => {
    axios.get(`${backend_api}/get_mail`).then((response) => {
      if (response.status == 200) {
        setFromMail(response.data.data[0].mail)
        let mailList = []
        response?.data?.data?.forEach((mailItem, index) => {
          mailList.push({...mailItem, value: index, label: mailItem.mail})
        });
        setMails(mailList)
        setDefaultMailValue(mailList[0].value)
        console.log("mailsssssssss", mailList[0].value)
        mailFromServer.current = response.data.data[0].mail

      } else {
        api.info({
          message: `Server Error`,
          description: <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>,
          placement: 'topRight'
        });
      }
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  const handleMailContentChange = (e) => {
    setMailContent(e.target.value);
  }

  const handleFromMailChange = (e) => {
    setFromMail(e.target.value )
    e.target.value == mailFromServer?.current ? setIsCompared(true) : setIsCompared(false)
  }

  const handleSubjectChange = (e) => {
    setMail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }


  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value)
  }

  const handleFromMailSelectChange = (value) => {
    setMail(mails[value].Name)
    setMailContent(mails[value].Prompt)
    
  }

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true)
  }

  const handleAddOk = () => {
    setAddMailLoading(true)
    if(password !== rePassword) {
      alert('password does not match')
      return
    }

    const requestParam = {
      from: newEmail,
      mail: newSubject,
      content: newMailContent,
      password: password
    }
    axios.post(`${backend_api}/add_mail`, requestParam, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log(response)
      setAddMailLoading(false)
      setIsAddModalOpen(false)
      if(response.status == 200) {
        api.success({
          message: `Success`,
          description: (
            <Context.Consumer>
              {({}) => `Added successfully`}
            </Context.Consumer>
          ),
          placement: "topRight",
        });

      } else {
        api.info({
          message: `Edit Failed`,
          description: (
            <Context.Consumer>
              {({}) => `Error Occured`}
            </Context.Consumer>
          ),
          placement: "topRight",
        });

      }
    }).catch((error) => {
      setAddMailLoading(false)
      setIsAddModalOpen(false)
      console.log(error)
    })

  }

  const handleCancel = () => {
    setIsAddModalOpen(false)
  }

  const handleNewSubject = (e) => {
    setNewSubject(e.target.value)
  }

  const handleNewMailContent = (e) => {
    setNewMailContent(e.target.value)
  }

  const handleChangeButtonClick = () => {
   
    const requestParam = {
      from: fromMail,
      mail,
      content: mailContent
    }
    setAddMailLoading(true);
    axios.post(`${backend_api}/mail`, requestParam, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log(response)
      if(response.status == 200) {
        api.success({
          message: `Success`,
          description: (
            <Context.Consumer>
              {({}) => `Updated successfully`}
            </Context.Consumer>
          ),
          placement: "topRight",
        });

      } else {
        api.info({
          message: `Failed`,
          description: (
            <Context.Consumer>
              {({}) => `Error Occured`}
            </Context.Consumer>
          ),
          placement: "topRight",
        });

      }
    }).catch((error) => {
      api.info({
        message: `Failed`,
        description: (
          <Context.Consumer>
            {({}) => `Error Occured`}
          </Context.Consumer>
        ),
        placement: "topRight",
      });
    }).finally(() => {
      setAddMailLoading(false)
    })
  }

  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Edit Sending Mail">
              <Typography.Title level={5}>From</Typography.Title>
              <Row align="middle">
                <Select
                  placeholder="Select Mail"
                  onChange={handleFromMailSelectChange}
                  style={{marginRight: '20px', minWidth: '200px'}}
                  options={mails}
                />
                <Button type="primary" onClick={handleAddModalOpen}>Add</Button>
              </Row>
              <div style={{ marginBottom: "20px" }}></div>
             
              <Typography.Title level={5}>Subject</Typography.Title>
              <Input placeholder="Title of Mail" value={mail} onChange={handleSubjectChange} />
              <div style={{ marginBottom: "20px" }}></div>
              <Typography.Title level={5}>Content</Typography.Title>
              <TextArea
                placeholder="Thank you so much for sending us the referral, We have received it. For the next steps, please see the links."
                autoSize={{
                  minRows: 2,
                  maxRows: 10,
                }}
                value={mailContent}
                onChange={handleMailContentChange}
              />
              <div style={{ marginBottom: "20px" }}></div>
              <Row justify="end">
                <Col>
                  <Button type="primary" onClick={handleChangeButtonClick} loading={addMailLoading}>Change</Button>
                </Col>
              </Row>
              <div style={{display: !isCompared ? 'inline-block' : 'none'}}>
                <div style={{ marginBottom: "20px" }}></div>
                <Typography.Text level={5}>* To Set New Mail You need to provide your password and you typically need to configure your email client settings (such as SMTP for sending emails and IMAP or POP3 for receiving emails). These settings can be found in your Zoho Mail account under the email configuration or setup section. </Typography.Text>
                <div style={{ marginBottom: "20px" }}></div>
                <Typography.Title level={5}>Password</Typography.Title>
                <Input
                  placeholder="Enter your correct mail Password"
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                />
                <div style={{ marginBottom: "20px" }}></div>

              <Typography.Title level={5}>RePassword</Typography.Title>
                <Input
                  placeholder="Confirm Your Password"
                  type="password"
                  onChange={handleRePasswordChange}
                  value={rePassword}/>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal title="Add New Email" visible={isAddModalOpen} onOk={handleAddOk} confirmLoading={addMailLoading} onCancel={handleCancel}>
          <Row>
            <Col span={24}>
                <Typography.Title level={5}>From</Typography.Title>
                <Row align="middle">
                  <Input placeholder="Email" value={newEmail} status="error" onChange={(e) => setNewEmail(e.target.value)}/>
                </Row>
                <div style={{ marginBottom: "20px" }}></div>
              
                <Typography.Title level={5}>Subject</Typography.Title>
                <Input placeholder="Title of Mail" value={newSubject} onChange={handleNewSubject} />
                <div style={{ marginBottom: "20px" }}></div>
                <Typography.Title level={5}>Content</Typography.Title>
                <TextArea
                  placeholder="Thank you so much for sending us the referral, We have received it. For the next steps, please see the links."
                  autoSize={{
                    minRows: 5,
                    maxRows: 10,
                  }}
                  value={newMailContent}
                  onChange={handleNewMailContent}
                />
                <div style={{ marginBottom: "20px" }}></div>
                
                <div style={{display: 'inline-block'}}>
                  <div style={{ marginBottom: "20px" }}></div>
                  <Typography.Text level={5}>* To Set New Mail You need to provide your password and you typically need to configure your email client settings (such as SMTP for sending emails and IMAP or POP3 for receiving emails). These settings can be found in your Zoho Mail account under the email configuration or setup section. </Typography.Text>
                  <div style={{ marginBottom: "20px" }}></div>
                  <Typography.Title level={5}>Password</Typography.Title>
                  <Input
                    placeholder="Enter your correct mail Password"
                    type="password"
                    onChange={handlePasswordChange}
                    value={password}
                  />
                  <div style={{ marginBottom: "20px" }}></div>

                <Typography.Title level={5}>RePassword</Typography.Title>
                  <Input
                    placeholder="Confirm Your Password"
                    type="password"
                    onChange={handleRePasswordChange}
                    value={rePassword}/>
                </div>
            </Col>
          </Row>
        </Modal>
      </div>
    </Context.Provider>
  );
}

export default Mail;
