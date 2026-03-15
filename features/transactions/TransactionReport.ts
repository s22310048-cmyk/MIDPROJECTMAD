import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type TransactionRow = {
  transaction_date: number;
  user_name: string;
  book_title?: string;
  transaction_type: string;
  status: string;
  fine_amount: number;
};

/**
 * generateCSVAndDownload takes a list of transactions, converts them to a CSV format,
 * saves it locally, and prompts the user to share/download the file.
 */
export const generateCSVAndDownload = async (transactions: TransactionRow[]) => {
  try {
    // 1. Convert Data to CSV format
    const header = "Date,User Name,Book Title,Transaction Type,Status,Fine Amount\n";
    const rows = transactions.map((t) => {
      // Clean up fields that might have commas
      const dateStr = new Date(t.transaction_date).toLocaleString().replace(/,/g, '');
      const userName = `"${t.user_name || ''}"`;
      const bookTitle = `"${t.book_title || '-'}"`;
      const type = t.transaction_type;
      const status = t.status;
      const fine = t.fine_amount;

      return `${dateStr},${userName},${bookTitle},${type},${status},${fine}`;
    });

    const csvContent = header + rows.join('\n');

    // 2. Determine File Path
    const filename = `Transactions_Report_${Date.now()}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // 3. Write CSV to local FileSystem
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 4. Check if Sharing is available and share
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Download Transaction Report',
      });
    } else {
      console.log('Sharing is not available on this platform.');
    }
  } catch (error) {
    console.error('Error generating transaction report:', error);
  }
};
