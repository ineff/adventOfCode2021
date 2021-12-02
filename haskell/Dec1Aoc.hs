module Dec1Aoc where 

import Prelude hiding (fst, snd)
import System.IO
{--
This module contains the definition for the function and
objects for solving the problem of December the first
of the Advent of code 2021
-}

type Line = String

data Acc = Acc {
  fst :: Integer,
  snd :: Integer,
  counter :: Integer
  } deriving(Eq,Read,Show)

update :: Acc -> Line -> Acc
update acc line =
  let
    newNum = read line :: Integer
  in
    Acc {
    fst = snd acc,
    snd = newNum,
    counter = if (snd acc < newNum)
              then ((counter acc) + 1)
              else (counter acc)
  }

data Acc' = Acc' {
  fst' :: Integer,
  snd' :: Integer,
  thr'  :: Integer,
  lastTriple :: Integer,
  counter' :: Integer
  } deriving(Eq, Show, Read)

update' :: Acc' -> Line -> Acc'
update' acc line =
  let t = read line
      f = snd' acc
      s = thr' acc
  in
    Acc' {
    fst' = f,
    snd' = s,
    thr' = t,
    lastTriple = f + s + t,
    counter' =
        if (lastTriple acc < (f+s+t))
        then (counter' acc)+1
        else counter' acc
    }
  

main :: IO()
main = do
  file <-  openFile "1DecAoc.txt" ReadMode
  rawText <- hGetContents file
  let datas = lines rawText
  let f = read (datas !! 0)
  print $
    foldl update (Acc f 0 0) (drop 1 datas)
  let f = read (datas !! 0) 
      s = read (datas !! 1)
      t = read (datas !! 2)
      acc' = Acc' f s t (f+s+t) 0
    in 
    print $ foldl update' acc' (drop 3 datas)
    
