//=====================================================
//  IMPORTACIONES
//=====================================================
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'




//=====================================================
//  EXPORTACIONES DEL "useSelector" y "useDispatch"
//=====================================================
/*
    "useSelector": RENOMBRADO COMO "useReduxSelector"
    "useDispatch": RENOMBRADO A "useReduxDispatch"
*/
export const useReduxDispatch = () => useDispatch<AppDispatch>()
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector