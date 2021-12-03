module Dec3Aoc where

import System.IO
import qualified Data.Map as M
import Data.Bits

type Str = String
type Acc = M.Map Integer Integer


update :: (Acc, Integer) -> Str -> (Acc, Integer)
update (acc, n) line =
  case line of
    "" -> (acc, n)
    '1':rest -> update (M.update (\n -> Just (n + 1)) (n `mod` 12) acc,(n + 1)) rest
    '0':rest -> update (M.update (\n -> Just (n - 1)) (n `mod` 12) acc,(n + 1)) rest
    _ -> (acc,-1)

start :: Acc
start = M.fromAscList [(i,0)| i<- [0..11]]

sign :: Integer -> Integer
sign n = if n >= 0 then 1 else 0
  
getBin :: Acc -> Integer -- we expect Acc to be a Map [0..11] Integer
getBin acc = ausil 0 acc 0
  where ausil n acc num =
          if n >= 12
          then
            num
          else
            ausil (n + 1) acc (num + (sign (extract acc (n `mod` 12)))*2^(11-n))
        extract acc n =
          case M.lookup n acc of
            Just val -> val
            Nothing -> 0

split :: [Str] -> Integer -> ([Str],[Str])
-- split list n:
-- split a list of strings into two lists
-- the first one made by all the elements that
-- have a '1' in position (n `mod` 12)
-- the others that have '0' in the same position
split lines n = ausil ([],[]) lines 
  where ausil (ones,zeros) [] = (ones,zeros)
        ausil (ones,zeros) (line:rest) =
          if (line !! fromInteger (n `mod` 12)) == '1'
          then ausil ((line:ones),zeros) rest
          else ausil (ones,(line:zeros)) rest

selMostComm :: [Str] -> [Str]
selMostComm lines = ausil 0 lines
  where ausil n list =
          if n >= 12
          then list
          else
            let
              (ones, zeros) = split list n
              list' = if (length ones) >= (length zeros)
                      then ones
                      else zeros
            in ausil (n + 1) list'

selLeastComm lines = ausil 0 lines
  where ausil n list =
          if n >= 12
          then list
          else
            let
              (ones, zeros) = split list n
              list' = if ((length ones) >= (length zeros)) &&  (length zeros > 0) || (length ones) == 0
                then zeros
                else ones
            in ausil (n + 1) list'

getBin' :: Str -> Integer
getBin' binNum = ausil 0 binNum
  where ausil n "" = n
        ausil n (digit:digits) =
          if digit == '0'
          then ausil (n * 2) digits
          else ausil (n * 2 + 1) digits
  
          
main :: IO()
main = do
  file <- openFile "Dec3Aoc.txt" ReadMode
  rawText <- hGetContents file
  let datas = lines rawText 
  let (acc, iter) = foldl update (start, 0) datas
  print acc
  let gamma = getBin acc
  let epsilon = (gamma `xor` (2^12 - 1)) .&. (2^12-1)
  print $ "gamma = "++(show gamma)++" epsilon = "++(show epsilon)++
    " first solution = "++(show (gamma * epsilon))
  -- let (ones, zeros) = split datas 0
  -- print $ "ones has length = " ++ (show $ length ones)++
  --  " while zeros has length = " ++ (show $ length zeros)
  let oxSel = (selMostComm datas) !! 0
  let co2Sel = (selLeastComm datas) !! 0
  let oxRate = getBin' oxSel
  let co2Rate = getBin' co2Sel
  print $ ((selLeastComm datas))
  print $ "oxygen rating is = "++(show oxRate)++" co2 scattering ratings = "++
    (show co2Rate)++" final result = "++(show (oxRate * co2Rate))
  hClose file
