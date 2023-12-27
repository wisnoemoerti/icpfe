import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from 'axios';
import TicketFormModal from './TicketFormModal';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // const [columns, setColumns] = useState(taskStatus);
  const [showModal, setShowModal] = useState(false);
  const [columns, setColumns] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://be-test.test/api/tickets');
      console.log(response.data);
      setColumns(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveTicket = async (newTicketData) => {
    try {
      const response = await axios.post('http://be-test.test/api/tickets', {
        judul_tiket:newTicketData.judul_tiket,
        tipe_tiket:newTicketData.tipe_tiket.value,
        assigned_to:newTicketData.assigned_to.value,
        description:newTicketData.description,
        label:newTicketData.label.value,
        project_name:newTicketData.project_name.value,
      });


      if (response.status === 201) {
        fetchData();
        console.log('Create ticket successfully');
      } else {
        console.error('Failed to update ticket:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    handleCloseModal();
  };

  useEffect(() => {
    fetchData();
  }, []);


  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    const originalColumns = { ...columns };

    // Lakukan perubahan state yang direncanakan
    const updatedColumns = {
      ...columns,
      [source.droppableId]: {
        ...columns[source.droppableId],
        items: [...columns[source.droppableId].items],
      },
      [destination.droppableId]: {
        ...columns[destination.droppableId],
        items: [...columns[destination.droppableId].items],
      },
    };

    // Hapus item dari sumber
    const [removed] = updatedColumns[source.droppableId].items.splice(source.index, 1);

    // Masukkan item ke tujuan
    updatedColumns[destination.droppableId].items.splice(destination.index, 0, removed);
    setColumns(updatedColumns);
    try {
      const response = await axios.post('http://be-test.test/api/tickets/drag', {
        id: parseInt(draggableId),
        label:
          destination.droppableId === 'todo'
            ? 'To Do'
            : destination.droppableId === 'doing'
            ? 'Doing'
            : destination.droppableId === 'testing'
            ? 'Testing'
            : 'Done',
        newIndex: destination.index,
      });


      if (response.status === 201) {
        // Jika panggilan API berhasil, atur state ke perubahan yang direncanakan
        // setColumns(updatedColumns);
        console.log('Update ticket successfully');
      } else {
        // Jika API panggilan gagal, kembalikan state ke state awal
        setColumns(originalColumns);
        console.error('Failed to update ticket:', response.data.message);
      }
    } catch (error) {
      // Jika terjadi kesalahan, kembalikan state ke state awal
      setColumns(originalColumns);
      console.error('Error fetching data:', error);
    }
  };
  


  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#000" }}>
        PT ICP Cipta Prima Board.
      </h1>
      <Button variant="primary" onClick={handleShowModal}>
        Add New
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          background: "#0079bf",
          color: "#fff",
          padding: "20px 0",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 10px",
                }}
                key={columnId}
              >
                <h2
                  style={{
                    background: "#4d79ff",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {column.name}
                </h2>
                <div style={{ margin: "8px" }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: "8px",
                            width: "250px",
                            minHeight: "500px",
                            borderRadius: "8px",
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={`${item.id}`}
                                draggableId={`${item.id}`}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: "16px",
                                        margin: "0 0 8px 0",
                                        borderRadius: "8px",
                                        border: "1px solid #bbb",
                                        minHeight: "100px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#eaeaea"
                                          : "#eee",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div
                                        style={{
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          color: "#000",
                                        }}
                                      >
                                        {item.no_tiket}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          marginBottom: "8px",
                                          color: "#000",
                                        }}
                                      >
                                        [{item.project_name}][{item.tipe_tiket}] - {item.judul_tiket}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <div style={{ flex: 1, color: "#000", }}>
                                          <div>Feature</div>
                                          <div>{item.description}</div>
                                        </div>
                                        <div style={{ flex: 1, color: "#000", }}>
                                          <div>Task</div>
                                          <div>{item.tipe_tiket}</div>
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "12px",
                                          marginTop: "8px",
                                        }}
                                      >
                                        <div style={{ flex: 1, color: "#000", }}>
                                          <div>Assigned To</div>
                                          <div>{item.assigned_to}</div>
                                        </div>
                                        <div style={{ flex: 1, color: "#000", }}>
                                          <div>Due Date</div>
                                          <div>22 December 2023</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      <TicketFormModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveTicket}
      />
    </div>
  );
}

export default App;
