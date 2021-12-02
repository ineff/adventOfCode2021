module Dec2Aoc where

import Prelude hiding (fst, snd)
import System.IO
{--
This module contains the definition for the function and
objects for solving the problem of December the second
of the Advent of code 2021
-}

type Line = String

data State = State {
  x :: Integer,
  y :: Integer
  } deriving(Show,Read,Eq)


update :: State -> Line -> State
update acc line =
  case line of
    'f':'o':'r':'w':'a':'r':'d':' ':rest ->
      let num = read rest :: Integer
      in
        acc { x = (x acc) + num }
    'u':'p':' ':rest ->
      let num = read rest :: Integer
      in
        acc { y = (y acc) - num }
    'd':'o':'w':'n':' ':rest ->
      let num = read rest :: Integer
      in
        acc { y = (y acc) + num }

data State' = State' {
  x' :: Integer,
  y' :: Integer,
  aim :: Integer
  } deriving(Show, Eq, Read)

update' :: State' -> Line -> State'
update' acc line =
  case line of
    'f':'o':'r':'w':'a':'r':'d':' ':rest ->
      let num = read rest :: Integer
      in
        acc { x' = (x' acc) + num, y' = (y' acc) + (aim acc) * num }
    'u':'p':' ':rest ->
      let num = read rest :: Integer
      in
        acc { aim = (aim acc) - num }
    'd':'o':'w':'n':' ':rest ->
      let num = read rest :: Integer
      in
        acc { aim = (aim acc) + num }
    

main :: IO()
main = do
  file <- openFile "2DecAoc.txt" ReadMode
  rawtext <- hGetContents file
  let datas = lines rawtext
  let computation =  foldl update (State 0 0) datas
  print computation
  print ((x computation) * (y computation))
  let computation' = foldl update' (State' 0 0 0) datas
  print computation'
  print ((x' computation') * (y' computation'))
  hClose file

  
  
