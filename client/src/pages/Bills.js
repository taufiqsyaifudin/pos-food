import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
function Bills() {
    const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibilty] =
    useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const dispatch = useDispatch();
  const getAllBills = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-bills")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data
        data.reverse()
        setBillsData(data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "customerName",
    },
    {
      
      title: "Phone Number",
      dataIndex: "customerPhoneNumber",
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      render: (id, record) => (
        <div>
          <p>Rp. {(record.subTotal).toLocaleString(undefined, {maximumFractionDigits:1})}</p>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "customerAddress",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (id, record) => (
        <div>
          <p>Rp. {(record.totalAmount).toLocaleString(undefined, {maximumFractionDigits:1})}</p>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibilty(true);
            }}
          />
        </div>
      ),
    },
  ];
  const cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (id, record) => (
        <div>
          <p>Rp. {(record.price).toLocaleString(undefined, {maximumFractionDigits:1})}</p>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <p>{record.quantity}</p>
        </div>
      ),
    },
    {
        title: "Total Fare",
        dataIndex: "_id",
        render: (id, record) => (
          <div>
            <p>Rp. {(record.quantity * record.price).toLocaleString(undefined, {maximumFractionDigits:1})}</p>
          </div>
        ),
      },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />

      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibilty(false);
          }}
          visible={printBillModalVisibility}
          title="Bill Details"
          footer={false}
          width={800}
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h1>
                  <b>TAUFIQ MARKET</b>
                </h1>
              </div>
              <div>
                <p>Jakarta</p>
                <p>Jakarta 500013</p>
                <p>9989649278</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <p>
                <b>Name</b> : {selectedBill.customerName}
              </p>
              <p>
                <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
              </p>
              <p>
                <b>Address</b> : {selectedBill.customerAddress}
              </p>
              <p>
                <b>Date</b> :{" "}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table dataSource={selectedBill.cartItems} columns={cartcolumns} pagination={false}/>

            <div className="dotted-border">
                <p><b>SUB TOTAL</b> : Rp. {selectedBill.subTotal.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
                <p><b>Tax</b> : Rp. {selectedBill.tax.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
            </div>

            <div>
                <h2><b>GRAND TOTAL : Rp. {selectedBill.totalAmount.toLocaleString(undefined, {maximumFractionDigits:1})}</b></h2>
            </div>
            <div className="dotted-border"></div>

            <div className="text-center">
                  <p>Thanks</p>
                  <p>Visit Again :)</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
                  <Button type='primary' onClick={handlePrint}>Print Bill</Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default Bills;
