import { supportsTauri } from '../backend';
import LocalStorageStrategy from '../store/strategies/localStorage';
import TauriFileSystemStrategy from '../store/strategies/tauriFileSystem';
import Serializible from './types/serializible';

/**
 * T is the data type
 */
const getStrategy = <T>(defaults: T, serializer: Serializible<T> = {}) => supportsTauri()
  ? new TauriFileSystemStrategy<T>(defaults, serializer)
  : new LocalStorageStrategy<T>(defaults, serializer);

export default getStrategy;