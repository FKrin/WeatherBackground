package gameoflife;

public class Playground {
	 private boolean[][][] playground;

	    public Playground(boolean[][] initialCells) {

	        copyInitialCellsToPlayground(initialCells);
	    }

	    private void copyInitialCellsToPlayground(boolean[][] initialCells) {
	        int columnsInitialCells = initialCells.length;
	        int rowsInitialCells = initialCells[0].length;
	        playground = new boolean[columnsInitialCells][rowsInitialCells][2];
	        for (int column = 0; column < columnsInitialCells; column++) {
	            for (int row = 0; row < rowsInitialCells; row++) {
	                playground[column][row][0] = initialCells[column][row];
	            }
	        }
	    }

	    public boolean[][][] getPlayground(){
	        return playground;
	    }

	    public void nextGeneration() {
	        for (int column = 0; column < playground.length; column++) {
	            for (int row = 0; row < playground[0].length; row++) {
	                playground[column][row][1] = isCellAliveNextGeneration(column, row);
	            }
	        }
	        copyCellsInCurrentGeneration();
	    }

	    private void copyCellsInCurrentGeneration() {
	        for (int column = 0; column < playground.length; column++) {
	            for (int row = 0; row < playground[0].length; row++) {
	                playground[column][row][0] = playground[column][row][1];
	            }
	        }
	    }

	    private boolean isCellAliveNextGeneration(int column, int row) {
	        if (isCellAlive(column,row)) {
	            return isCellStillAliveNextGeneration(column,row);
	        } else {
	            return isCellBornNextGeneration(column, row);
	        }
	    }

	    private boolean isCellStillAliveNextGeneration(int column, int row) {
	        if (countNeighbours(column,row)==2 || countNeighbours(column,row)==3) {
	            return true;
	        }
	        return false;
	    }

	    private boolean isCellBornNextGeneration(int column, int row) {
	        if (countNeighbours(column,row)==3) {
	            return true;
	        }
	        return false;
	    }

	    private int countNeighbours(int column, int row) {
	        return isCellALivingNeighbour(column,row+1) + isCellALivingNeighbour(column+1,row+1) + isCellALivingNeighbour(column-1, row+1) +
	                isCellALivingNeighbour(column+1,row) + isCellALivingNeighbour(column-1,row) + isCellALivingNeighbour(column-1, row-1) +
	                isCellALivingNeighbour(column,row-1) + isCellALivingNeighbour(column+1,row-1);
	    }

	    private int isCellALivingNeighbour(int column, int row) {
	        if (column >= 0 && column < playground.length && row >= 0 && row < playground[0].length) {
	            if (isCellAlive(column,row)) {
	                return 1;
	            }
	        }
	        return 0;
	    }


	    private boolean isCellAlive(int column, int row) {
	        return playground[column][row][0];
	    }
}
