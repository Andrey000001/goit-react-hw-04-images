import { useEffect, useState, useRef } from 'react';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import FetchApi from 'components/Service/ServiceApi';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import LoadMore from 'components/Button/Button';

function App() {
  const [newName, setNewName] = useState('');
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  const prevName = useRef(newName);
  const prevPage = useRef(page);
  const getLargeImg = url => {
    setUrl(url);
    setShowModal(true);
  };
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { hits, total } = await FetchApi({ newName, page });
        if (newName === '' || total === 0) {
          setStatus('reject');
          toast.info(`По вашему запросу ничего не найденно ${newName}`);
        } else {
          setData(prevData => (page > 1 ? [...prevData, ...hits] : [...hits]));
          setStatus('resolve');
        }
        prevName.current = newName;
        prevPage.current = page;
      } catch (error) {
        setError(true);
        setStatus('reject');
        console.log(error);
      }
    };

    if (newName !== prevName.current || page !== prevPage.current) {
      setStatus('pending');
      fetchApi();
    }
  }, [newName, page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  const onCloseModal = () => {
    setShowModal(false);
  };
  const updateName = newName => {
    setNewName(newName);
    setData([]);
  };

  return (
    <>
      <Searchbar updateName={updateName} />
      {<ImageGallery data={data} showModal getLargeImg={getLargeImg} />}
      <ToastContainer autoClose={3000} />
      {status === 'pending' && <Loader />}
      {status !== 'pending' && data.length && (
        <LoadMore handleLoadMore={handleLoadMore} text="LoadMore..." />
      )}
      {showModal && (
        <Modal closeModal={onCloseModal} showModal={showModal} url={url} />
      )}
    </>
  );
}

export default App;
