import { fetchContacts } from "../../services/api";
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('fetchContacts', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Calls endpoint and returns data', async () => {
    const mockToken = "token";
    const mockResponse = [{ id: 1, name: 'Jon Terje' }];
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetchContacts(mockToken);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://test-api.softrig.com/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false',
      {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it('Adds search query properly', async () => {
    const mockToken = "token";
    const searchQuery = "Jon";
    const mockResponse = [{ id: 2, name: 'Jon Terje' }];
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetchContacts(mockToken, searchQuery);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `https://test-api.softrig.com/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false&filter=contains(Info.Name,'${encodeURIComponent(searchQuery)}')`,
      {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it('Error when network response is not ok', async () => {
    const mockToken = "token";
    fetch.mockReject(new Error("Network response was not ok"));

    await expect(fetchContacts(mockToken)).rejects.toThrow("Network response was not ok");
  });
});