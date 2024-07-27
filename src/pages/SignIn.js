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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  notification,
  Modal
} from "antd";
import axios from "axios";
import { backend_api } from "../config";
import { login } from "../store/authSlice";
import { useSelector, useDispatch } from "react-redux";
const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [token, setToken] = useState('');
  const [OTPCode, setOTPCode] = useState('');
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);


  useEffect(() => {
    if(user !== null) {
      history.push("/users");
      return;
    }
  }, [])
  
  const handleSignIn = () => {
    if (email == '') {
      notification.info({ message: 'Input your Email', description: 'Input your email address correctly' })
      return
    }
    setSendButtonLoading(true);
    axios.post(`${backend_api}/login`, { email, password }).then(response => {
      if (response.status == 200) {
        if (response.data.success == true) {
          dispatch(login(response.data.message))
          history.push('/users')
        } else {
          notification.error({ message: 'Error', description: response.data.message });
        }
      } else {
        notification.error({ message: 'Error', description: 'Server Error' });
      }
    }).catch(error => {
      console.log(error)
      notification.error({ message: 'Error', description: 'Server Error' });
    }).finally(() => {
      setSendButtonLoading(false)
    })
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Layout className="layout-default layout-signin" style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <Content className="signin" style={{ alignContent: 'center' }}>
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
           
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="Password"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                  />
                </Form.Item>

                <Form.Item
                  className="Password"
                  label="Password"
                  name="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Password"
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                    type="password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSignIn}
                    loading={sendButtonLoading}
                  >
                    LOGIN
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="link"
                    style={{ width: "100%" }}
                    onClick={() => history.push('/register')}
                  >
                    Dont have an account? Go to register
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
      {/* <Modal title="Input your OTP" visible={isModalOpen} onOk={handleSendOTP} confirmLoading={sendOTPLoading} onCancel={handleCancel}>
        <Row justify="center">
          <Col span={24}>
            <Form>
              <Form.Item>
                <Input onChange={(e) => {setOTPCode(e.target.value)}}/>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal> */}
    </>
  );
}

export default SignIn;
