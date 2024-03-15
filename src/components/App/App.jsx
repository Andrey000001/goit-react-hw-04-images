import { useEffect, useState } from 'react';

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

  const getLargeImg = url => {
    setUrl(url);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setStatus('pending');
      const { hits, total } = await FetchApi({ page, newName });
      try {
        if (!total) {
          toast.info(`По вашему запросу ${newName} ничего не найденно`);
          setStatus('reject');
        } else {
          setData(prevData => (page > 1 ? [...prevData, ...hits] : [...hits]));
          setStatus('resolve');
          toast.success(`По вашему запросу найденно ${total}`);
        }
      } catch {
        setStatus('reject');
        setError(error);
        console.error(error);
      }
    };
    if (page && newName) {
      fetchData();
    }
  }, [page, newName, error]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  const onCloseModal = () => {
    setShowModal(false);
  };
  const updateName = newName => {
    if (newName === '') {
      toast.info('Вы ничего не ввели!');
      return;
    } else {
      setNewName(newName);
      setPage(1);
      setData([]);
    }
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
