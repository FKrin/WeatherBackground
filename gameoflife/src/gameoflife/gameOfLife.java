package gameoflife;

import java.util.Random;

public class gameOfLife {
	 public static void main(String[] args) {
	        boolean[][] initialCells = initializeRandom(10);
	        Playground playground = new Playground(initialCells);

	        for (int i = 0; i < 10; i++) {
	            playground.nextGeneration();
	            printPlayground(playground.getPlayground());
	            System.out.println("");
	        }
	    }

	    private static void printPlayground(boolean[][][] playground) {
	        for (int column = 0; column < playground.length; column++) {
	            for (int row = 0; row < playground[0].length; row++) {
	                if (playground[column][row][0]) {
	                    System.out.print("X");
	                } else {
	                    System.out.print("O");
	                }
	            }
	            System.out.println("");
	        }
	    }

	    private static boolean[][] initializeRandom(int size) {
	        boolean[][] initial = new boolean[size][size];
	        Random random = new Random();
	        for (int column = 0; column < size; column++) {
	            for (int row = 0; row < size; row++) {
	                double randomDouble = random.nextDouble();
	                if (randomDouble < 1.8) {
	                    initial[column][row] = true;
	                }
	            }
	        }
	        return initial;
	    }
}
