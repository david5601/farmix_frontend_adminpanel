
import React, { useState } from "react";
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
} from "antd";

import axios from "axios";
import { backend_api } from "../config";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [token, setToken] = useState('');
  const [OTPCode, setOTPCode] = useState('');
  const [registerButtonLoading, setRegisterButtonLoading] = useState(false);
  const [userName, setUserName] = useState('')
  const history = useHistory();

  const handleSendOTP = () => {
    setSendOTPLoading(true);
    axios.post(`${backend_api}/verify_otp`, { token: token, code: OTPCode}).then(response => {
      console.log(response)
      
      if (response.status == 200) {
        if (response.data.success == true) {
          history.push('/dashboard')
        } else {
          notification.error({ message: 'Error', description: 'Failed to Login' });
        }
      } else {
        notification.error({ message: 'Error', description: 'Failed to send OTP' });
      }
      setSendOTPLoading(false);
    }).catch(error => {
      console.log(error);
      notification.error({ message: 'Error', description: 'Failed to send OTP' });
      setSendOTPLoading(false);
    })
  }

  const handleRegister = () => {
   
    if(email == '') {
      notification.info({message: 'Input Error', description: 'Please insert email'})
      return
    }
    if(!validateEmail(email)) {
      notification.info({message: 'Input Error', description: 'Please insert correct email address'})
      return
    }
    if(userName == '') {
      notification.info({message: 'Input Error', description: 'Please insert full name'})
      return
    }
    if(password == '' || repassword == '') {
      notification.info({message: 'Input Error', description: 'Please insert password'})
      return
    }
    if(password !== repassword) {
      notification.info({message: 'Password Missmatch', description: 'Please insert correct password'})
      return
    }
    setRegisterButtonLoading(true);
    axios.post(`${backend_api}/register`, { email, password, name: userName }).then(response => {
      if (response.status == 200) {
        if (response.data.success == true) {
          notification.success({message: 'Success', description: 'User created successfully'})
        } else {
          notification.error({ message: 'Error', description: response.data.message });
        }
      } else {
        notification.error({ message: 'Error', description: response.data.message });
      }
    }).catch(error => {
      console.log(error)
      notification.error({ message: 'Error', description: 'Register Failed' });
    }).finally(() => {
      setRegisterButtonLoading(false);
    })
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <>
      <Layout className="layout-default layout-signin" style={{position: 'absolute', height: '100%', width: '100%'}}>
        <Content className="signin" style={{alignContent: 'center'}}>
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign Up</Title>
              
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
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
                    type="email"
                  />
                </Form.Item>
                <Form.Item
                  className="username"
                  label="Full Name"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your full name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Full Name"
                    onChange={(e) => { setUserName(e.target.value) }}
                    value={userName}
                  />
                </Form.Item>


                <Form.Item
                  className="password"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
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


                <Form.Item
                  className="repassword"
                  label="Repeat Password"
                  name="repassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your repassword!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Repeat Password"
                    onChange={(e) => { setRePassword(e.target.value) }}
                    type="password"
                    value={repassword}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleRegister}
                    loading={registerButtonLoading}
                  >
                    Register
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="link"
                    style={{ width: "100%" }}
                    onClick={() => history.push('/')}
                  >
                    Go to login
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}

export default SignUp;
