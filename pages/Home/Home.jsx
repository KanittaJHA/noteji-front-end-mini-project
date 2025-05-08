import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../src/assets/images/add-notes.png";
import NoDataImg from "../../src/assets/images/no-data.png";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToasMsg, setShowToasMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToasMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToasMsg({
      isShown: false,
      message: "",
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/users/get-user");
  
      if (response.data?.user) {
        setUserInfo(response.data.user);
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Authentication failed. Redirecting to login...');
        navigate("/login");
      } else {
        console.error('Error fetching user information:', error.message);
      }
    }
  };  

  // Get All notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/api/notes/get-all-notes");

      console.log("Response from API:", response.data);

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  // Delete Note
  const deleteNote = async (date) => {
    const noteId = date._id;

    try {
      const response = await axiosInstance.delete(
        "/api/notes/delete-note/" + noteId
      );

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.", error);
      }
    }
  };

  // Search for a Note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/api/notes/search-notes/", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update IsPinned
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/api/notes/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => {
              return (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdAt}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? `Oops! No notes found matching your search.`
                : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, or reminders. Let’s get started!`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-[#F0BDA6] absolute right-10 bottom-10 cursor-pointer"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[50%] max-h-[70vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToasMsg.isShown}
        message={showToasMsg.message}
        type={showToasMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
